import 'dotenv/config'
import app from './app.js'
import connectDB from './lib/db.js'
import './lib/cloudinary.js' 

const PORT = process.env.PORT || 3000

async function main() {
    await connectDB()

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
