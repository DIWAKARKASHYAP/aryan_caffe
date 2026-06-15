import { X, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { CartLine, Product } from '../types'
import { formatPrice } from '../utils/format'

interface CartDrawerProps {
  open: boolean
  products: Product[]
  cart: CartLine[]
  tableNumber: number
  onClose: () => void
  onUpdateQty: (productId: string, delta: number) => void
  onConfirm: (note: string) => void
}

export function CartDrawer({
  open,
  products,
  cart,
  tableNumber,
  onClose,
  onUpdateQty,
  onConfirm,
}: CartDrawerProps) {
  const [note, setNote] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  if (!open) return null

  const lines = cart
    .map((line) => {
      const product = products.find((p) => p.id === line.productId)
      if (!product) return null
      return { ...line, product, total: product.price * line.qty }
    })
    .filter(Boolean) as Array<CartLine & { product: Product; total: number }>

  const subtotal = lines.reduce((s, l) => s + l.total, 0)

  const handleConfirm = () => {
    onConfirm(note)
    setNote('')
    setShowConfirm(false)
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-espresso/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85dvh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-espresso/10">
          <h2 className="font-display text-xl font-bold text-espresso">Your Order</h2>
          <button onClick={onClose} className="text-espresso/50 hover:text-espresso">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {lines.map((line) => (
            <div key={line.productId} className="flex items-center gap-3">
              <img
                src={line.product.image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{line.product.name}</p>
                <p className="text-amber text-sm font-medium">{formatPrice(line.total)}</p>
              </div>
              <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5">
                <button
                  onClick={() => onUpdateQty(line.productId, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-5 text-center text-sm font-bold">{line.qty}</span>
                <button
                  onClick={() => onUpdateQty(line.productId, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special requests? (optional)"
            rows={2}
            className="w-full mt-2 rounded-xl border border-espresso/15 bg-cream px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber/40"
          />
        </div>

        <div className="px-5 py-4 border-t border-espresso/10 space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span className="text-amber">{formatPrice(subtotal)}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full rounded-xl bg-espresso text-cream py-4 font-semibold text-base hover:bg-espresso/90 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-espresso/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="font-display text-xl font-bold text-espresso mb-2">
              Confirm order for Table {tableNumber}?
            </h3>
            <p className="text-sm text-espresso/60 mb-6">
              {lines.length} item{lines.length !== 1 ? 's' : ''} · {formatPrice(subtotal)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-espresso/20 py-3 font-semibold text-espresso hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-amber text-white py-3 font-semibold hover:bg-amber/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
