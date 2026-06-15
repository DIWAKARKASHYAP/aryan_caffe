import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { seedDatabase } from './db/seed.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import tablesRouter from './routes/tables.js'

const app = express()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brew-bean'

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/tables', tablesRouter)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    await seedDatabase()
    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
