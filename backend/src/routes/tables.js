import { Router } from 'express'
import { Table } from '../models/Table.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 })
    res.json(tables.map((t) => t.number))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const number = parseInt(req.body.number, 10)
    if (!number || number < 1) {
      res.status(400).json({ error: 'Valid table number required' })
      return
    }

    const existing = await Table.findOne({ number })
    if (existing) {
      res.status(409).json({ error: `Table ${number} already exists` })
      return
    }

    await Table.create({ number })
    const tables = await Table.find().sort({ number: 1 })
    res.status(201).json(tables.map((t) => t.number))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:number', async (req, res) => {
  try {
    const number = parseInt(req.params.number, 10)
    const result = await Table.findOneAndDelete({ number })
    if (!result) {
      res.status(404).json({ error: 'Table not found' })
      return
    }
    const tables = await Table.find().sort({ number: 1 })
    res.json(tables.map((t) => t.number))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
