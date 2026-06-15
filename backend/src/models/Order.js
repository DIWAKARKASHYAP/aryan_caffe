import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    qty: Number,
    price: Number,
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    tableNumber: { type: Number, required: true },
    items: [orderItemSchema],
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'served', 'payment_received', 'cancelled'],
      default: 'pending',
    },
    placedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
)

export const Order = mongoose.model('Order', orderSchema)

export function formatOrder(doc) {
  return {
    id: doc.orderId,
    tableNumber: doc.tableNumber,
    items: doc.items,
    note: doc.note,
    status: doc.status,
    placedAt: doc.placedAt.toISOString(),
  }
}
