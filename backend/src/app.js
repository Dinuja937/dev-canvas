
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'
import passport from './config/passport.js'
import authRoutes from './routes/auth.routes.js'
import projectRoutes from './routes/project.routes.js'
import notificationRoutes from "./routes/notification.routes.js";
import "./events/listners.js"; // register all event listeners

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(passport.initialize())


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use("/api/notifications", notificationRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
});

export default app;
