import { Router } from 'express'
import { Product } from '../models/Product.js'
import { Order, formatOrder } from '../models/Order.js'

const router = Router()

const VALID_STATUSES = [
  'pending',
  'preparing',
  'served',
  'payment_received',
  'cancelled',
]

function generateOrderId() {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${num}`
}

router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find().sort({ placedAt: -1 })
    res.json(orders.map(formatOrder))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { tableNumber, items, note } = req.body

    if (!tableNumber || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'tableNumber and items are required' })
      return
    }

    const resolvedItems = []
    for (const line of items) {
      const product = await Product.findOne({ productId: line.productId })
      if (!product) {
        res.status(400).json({ error: `Unknown product: ${line.productId}` })
        return
      }
      resolvedItems.push({
        productId: product.productId,
        name: product.name,
        qty: line.qty,
        price: product.price,
      })
    }

    let orderId = generateOrderId()
    let exists = await Order.findOne({ orderId })
    while (exists) {
      orderId = generateOrderId()
      exists = await Order.findOne({ orderId })
    }

    const order = await Order.create({
      orderId,
      tableNumber,
      items: resolvedItems,
      note: note || '',
      status: 'pending',
      placedAt: new Date(),
    })

    res.status(201).json(formatOrder(order))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true },
    )

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json(formatOrder(order))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
