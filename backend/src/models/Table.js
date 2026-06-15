import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
  },
  { versionKey: false },
)

export const Table = mongoose.model('Table', tableSchema)
