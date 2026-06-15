import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'

interface ProductCardProps {
  product: Product
  qty: number
  onAdd: () => void
  onIncrement: () => void
  onDecrement: () => void
}

export function ProductCard({
  product,
  qty,
  onAdd,
  onIncrement,
  onDecrement,
}: ProductCardProps) {
  const [bouncing, setBouncing] = useState(false)

  const handleAdd = () => {
    onAdd()
    setBouncing(true)
    setTimeout(() => setBouncing(false), 400)
  }

  return (
    <div className="rounded-xl bg-white shadow-md overflow-hidden flex flex-col">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold text-espresso leading-tight">{product.name}</h3>
        <p className="text-xs text-espresso/60 truncate">{product.description}</p>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-bold text-amber">{formatPrice(product.price)}</span>
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`rounded-lg bg-amber text-white text-sm font-semibold px-3 py-1.5 hover:bg-amber/90 transition-colors ${bouncing ? 'animate-bounce-once' : ''}`}
            >
              Add +
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-amber-light rounded-lg p-0.5">
              <button
                onClick={onDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-espresso hover:bg-cream"
                aria-label="Decrease"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={onIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-amber text-white hover:bg-amber/90"
                aria-label="Increase"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
