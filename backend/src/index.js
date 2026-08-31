import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import app from './app.js'
import connectDB from './lib/db.js'
import './lib/cloudinary.js' 
import { assertRequiredSecurityConfig } from './lib/security.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000

async function main() {
    assertRequiredSecurityConfig()
    await connectDB()

    const keyPath = process.env.SSL_KEY_PATH || path.resolve(__dirname, '../certs/localhost-key.pem')
    const certPath = process.env.SSL_CERT_PATH || path.resolve(__dirname, '../certs/localhost.pem')

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        const options = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        }
        https.createServer(options, app).listen(PORT, () => {
            console.log(`Server running on https://localhost:${PORT}`)
        })
    } else {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})


