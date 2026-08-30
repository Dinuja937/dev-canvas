
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import passport from './config/passport.js'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import projectRoutes from './routes/project.routes.js'
import likeRoutes from './routes/like.routes.js'
import followRoutes from './routes/follow.routes.js'
import notificationRoutes from "./routes/notification.routes.js";
import userRoutes from './routes/user.routes.js';
import "./events/listners.js"; // register all event listeners
import { assertRequiredSecurityConfig } from './lib/security.js';


const app = express()
assertRequiredSecurityConfig();

app.use(helmet())
// Do not log query strings: OAuth authorization codes and other credentials can appear there.
morgan.token('safe-url', (req) => req.path);
app.use(morgan(':method :safe-url :status :res[content-length] - :response-time ms'))
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: clientUrl, credentials: false, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Authorization', 'Content-Type'] }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use(passport.initialize())


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/follows', followRoutes)
app.use("/api/notifications", notificationRoutes);
app.use('/api/users', userRoutes);



app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.name, err.message);

  const status = err.status || (err.name === 'MulterError' || err.message.includes('Invalid file format') ? 400 : 500);
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? "Internal Server Error"
    : (err.message || "Internal Server Error");

  res.status(status).json({
    success: false,
    message,
  });
});

export default app;
