import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { TableQrCard } from './TableQrCard'

export function QrManager() {
  const { tables, addTable, removeTable } = useApp()
  const [tableInput, setTableInput] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    const num = parseInt(tableInput, 10)
    if (!num || num < 1) {
      setError('Enter a valid table number')
      return
    }
    const ok = await addTable(num)
    if (!ok) {
      setError(`Table ${num} already exists`)
      return
    }
    setTableInput('')
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white shadow-md p-5">
        <h3 className="font-semibold text-espresso mb-3">Add Table</h3>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            value={tableInput}
            onChange={(e) => {
              setTableInput(e.target.value)
              setError('')
            }}
            placeholder="Table number"
            className="flex-1 rounded-xl border border-espresso/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 rounded-xl bg-amber text-white font-semibold px-5 py-2.5 hover:bg-amber/90"
          >
            <Plus size={18} /> Generate QR
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((t) => (
          <TableQrCard key={t} tableNumber={t} onRemove={() => removeTable(t)} />
        ))}
      </div>
    </div>
  )
}
