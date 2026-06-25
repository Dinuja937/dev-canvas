
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)

    const status = err.status || 500
    const message = err.message || 'Internal Server Error'

    res.status(status).json({
        success: false,
        message,
    })
})

export default app