import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import type { Order, OrderStatus } from '../types'
import {
  formatPrice,
  nextStatus,
  statusEmoji,
  statusLabel,
  STATUS_COLORS,
  timeAgo,
} from '../utils/format'

interface AdminOrderCardProps {
  order: Order
  onUpdateStatus: (id: string, status: OrderStatus) => void
  onCancel: (id: string) => void
}

export function AdminOrderCard({ order, onUpdateStatus, onCancel }: AdminOrderCardProps) {
  const [showCancel, setShowCancel] = useState(false)
  const [showAdvance, setShowAdvance] = useState(false)
  const next = nextStatus(order.status)
  const canCancel = order.status !== 'payment_received' && order.status !== 'cancelled'

  return (
    <div className="rounded-xl bg-white shadow-md p-4 animate-fade-in transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-2xl font-bold text-espresso">🪑 Table {order.tableNumber}</p>
          <p className="text-xs text-espresso/50 mt-0.5">
            {order.id} · {timeAgo(order.placedAt)}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[order.status]}`}
        >
          {statusEmoji(order.status)} {statusLabel(order.status)}
        </span>
      </div>

      <ul className="space-y-1 mb-3 text-sm">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between">
            <span>
              {item.qty}× {item.name}
            </span>
            <span className="text-espresso/50">{formatPrice(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>

      {order.note && (
        <p className="text-xs italic text-espresso/60 bg-cream rounded-lg px-3 py-2 mb-3">
          &ldquo;{order.note}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-espresso/10">
        <strong className="text-amber">{formatPrice(order.items.reduce((s, i) => s + i.price * i.qty, 0))}</strong>

        {order.status !== 'cancelled' && order.status !== 'payment_received' && (
          <div className="flex gap-2">
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg"
              >
                Cancel
              </button>
            )}
            {next && (
              <button
                onClick={() => setShowAdvance(true)}
                className="text-xs font-semibold bg-espresso text-cream px-3 py-1.5 rounded-lg hover:bg-espresso/90 flex items-center gap-1"
              >
                → {statusLabel(next)}
                <ChevronDown size={12} className="rotate-[-90deg]" />
              </button>
            )}
          </div>
        )}
      </div>

      {showAdvance && next && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-espresso/50" onClick={() => setShowAdvance(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowAdvance(false)}
              className="absolute top-4 right-4 text-espresso/40"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-lg font-bold mb-2">Move order forward?</h3>
            <p className="text-sm text-espresso/60 mb-5">
              Table {order.tableNumber} · {order.id}
              <br />
              <span className="mt-1 inline-block">
                {statusEmoji(order.status)} {statusLabel(order.status)} → {statusEmoji(next)}{' '}
                {statusLabel(next)}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvance(false)}
                className="flex-1 rounded-xl border py-2.5 font-semibold"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(order.id, next)
                  setShowAdvance(false)
                }}
                className="flex-1 rounded-xl bg-espresso text-cream py-2.5 font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-espresso/50" onClick={() => setShowCancel(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowCancel(false)}
              className="absolute top-4 right-4 text-espresso/40"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-lg font-bold mb-2">Cancel this order?</h3>
            <p className="text-sm text-espresso/60 mb-5">
              Table {order.tableNumber} · {order.id}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 rounded-xl border py-2.5 font-semibold"
              >
                Keep
              </button>
              <button
                onClick={() => {
                  onCancel(order.id)
                  setShowCancel(false)
                }}
                className="flex-1 rounded-xl bg-red-600 text-white py-2.5 font-semibold"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
