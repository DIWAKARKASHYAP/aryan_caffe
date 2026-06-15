import { Router } from 'express'
import { Product } from '../models/Product.js'
import { formatProduct } from '../db/seed.js'

const router = Router()

const CATEGORIES = ['Coffee', 'Cold Drinks', 'Snacks', 'Desserts', 'Food']
const MAX_IMAGE_LENGTH = 4 * 1024 * 1024 // ~4MB base64 string

function validateImage(image) {
  if (!image) return 'Image is required'
  if (image.length > MAX_IMAGE_LENGTH) return 'Image too large (max ~3MB file)'
  const isDataUrl = image.startsWith('data:image/')
  const isUrl = image.startsWith('http://') || image.startsWith('https://')
  if (!isDataUrl && !isUrl) return 'Image must be a file upload or valid URL'
  return null
}

async function generateProductId() {
  let id = `p${Date.now()}`
  while (await Product.findOne({ productId: id })) {
    id = `p${Date.now()}${Math.floor(Math.random() * 100)}`
  }
  return id
}

router.get('/', async (_req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 })
    res.json(products.map(formatProduct))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body

    if (!name?.trim()) {
      res.status(400).json({ error: 'Name is required' })
      return
    }
    if (!CATEGORIES.includes(category)) {
      res.status(400).json({ error: 'Invalid category' })
      return
    }
    if (typeof price !== 'number' || price < 0) {
      res.status(400).json({ error: 'Valid price is required' })
      return
    }
    const imageError = validateImage(image)
    if (imageError) {
      res.status(400).json({ error: imageError })
      return
    }

    const productId = await generateProductId()
    const product = await Product.create({
      productId,
      name: name.trim(),
      category,
      description: description?.trim() || '',
      price,
      image,
    })

    res.status(201).json(formatProduct(product))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { name, category, description, price, image } = req.body
    const updates = {}

    if (name !== undefined) {
      if (!name?.trim()) {
        res.status(400).json({ error: 'Name cannot be empty' })
        return
      }
      updates.name = name.trim()
    }
    if (category !== undefined) {
      if (!CATEGORIES.includes(category)) {
        res.status(400).json({ error: 'Invalid category' })
        return
      }
      updates.category = category
    }
    if (description !== undefined) updates.description = description.trim()
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        res.status(400).json({ error: 'Valid price is required' })
        return
      }
      updates.price = price
    }
    if (image !== undefined) {
      const imageError = validateImage(image)
      if (imageError) {
        res.status(400).json({ error: imageError })
        return
      }
      updates.image = image
    }

    const product = await Product.findOneAndUpdate(
      { productId: req.params.id },
      updates,
      { new: true },
    )

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    res.json(formatProduct(product))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.id })
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.json({ ok: true, id: product.productId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
