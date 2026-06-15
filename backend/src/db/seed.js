import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { Table } from '../models/Table.js'
import { PRODUCTS, SEED_ORDERS } from '../data/seed.js'

export async function seedDatabase() {
  const productCount = await Product.countDocuments()
  if (productCount === 0) {
    await Product.insertMany(PRODUCTS)
    console.log(`Seeded ${PRODUCTS.length} products`)
  }

  const orderCount = await Order.countDocuments()
  if (orderCount === 0) {
    await Order.insertMany(SEED_ORDERS)
    console.log(`Seeded ${SEED_ORDERS.length} orders`)
  }

  const tableCount = await Table.countDocuments()
  if (tableCount === 0) {
    const tables = Array.from({ length: 20 }, (_, i) => ({ number: i + 1 }))
    await Table.insertMany(tables)
    console.log('Seeded 20 tables')
  }
}

export function formatProduct(doc) {
  return {
    id: doc.productId,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    price: doc.price,
    image: doc.image,
  }
}
