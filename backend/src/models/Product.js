import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { versionKey: false },
)

export const Product = mongoose.model('Product', productSchema)
