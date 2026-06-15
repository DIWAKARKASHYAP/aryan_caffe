import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { OrderStatus } from '../types'
import { FILTER_STATUSES, statusLabel, type StatusFilter } from '../utils/format'
import { AdminOrderCard } from './AdminOrderCard'

const KANBAN_COLUMNS: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pending', color: 'border-yellow-400' },
  { status: 'preparing', label: 'Preparing', color: 'border-blue-400' },
  { status: 'served', label: 'Served', color: 'border-green-400' },
  { status: 'payment_received', label: 'Paid', color: 'border-teal-400' },
]

export function LiveOrders() {
  const { orders, updateOrderStatus, cancelOrder } = useApp()
  const [filter, setFilter] = useState<StatusFilter>('all')

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    for (const o of orders) {
      c[o.status] = (c[o.status] ?? 0) + 1
    }
    return c
  }, [orders])

  const filtered = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const activeOrders = orders.filter(
    (o) => o.status !== 'cancelled' && o.status !== 'payment_received',
  )

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-espresso/50">
        <span className="text-5xl mb-4">☕</span>
        <p className="text-lg font-medium">No orders yet.</p>
        <p className="text-sm">Waiting for the first customer…</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {FILTER_STATUSES.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-espresso text-cream'
                : 'bg-white text-espresso/70 shadow-sm hover:bg-amber-light'
            }`}
          >
            {f === 'all' ? 'All' : statusLabel(f as OrderStatus)} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {/* Kanban on desktop when showing active, list when filtered */}
      {filter === 'all' || filter === 'cancelled' ? (
        filter === 'cancelled' ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => (
              <AdminOrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                onCancel={cancelOrder}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {KANBAN_COLUMNS.map((col) => {
              const colOrders = orders.filter((o) => o.status === col.status)
              return (
                <div key={col.status} className={`rounded-xl border-t-4 ${col.color} bg-white/50 p-3 min-h-[200px]`}>
                  <h3 className="font-semibold text-sm text-espresso/70 mb-3 px-1">
                    {col.label} ({colOrders.length})
                  </h3>
                  <div className="space-y-3">
                    {colOrders.map((order) => (
                      <AdminOrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                        onCancel={cancelOrder}
                      />
                    ))}
                    {colOrders.length === 0 && (
                      <p className="text-xs text-espresso/30 text-center py-6">Empty</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              onCancel={cancelOrder}
            />
          ))}
        </div>
      )}

      {activeOrders.length > 0 && filter === 'all' && (
        <p className="text-xs text-espresso/40 text-center">
          Auto-refreshing every 12 seconds · {activeOrders.length} active
        </p>
      )}
    </div>
  )
}
