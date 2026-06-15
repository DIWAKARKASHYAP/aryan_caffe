import 'dotenv/config'
import app, { connectDB } from './app.js'

const PORT = process.env.PORT || 3001

async function start() {
  try {
    await connectDB()
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
