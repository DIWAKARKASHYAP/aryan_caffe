import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { seedDatabase } from './db/seed.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import tablesRouter from './routes/tables.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/tables', tablesRouter)

let connectPromise = null

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return

  if (!connectPromise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI environment variable is not set')

    connectPromise = mongoose.connect(uri).then(async () => {
      await seedDatabase()
    })
  }

  await connectPromise
}

export default app
