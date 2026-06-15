import type { OrderStatus } from '../types'

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} mins ago`
  const hrs = Math.floor(mins / 60)
  return hrs === 1 ? '1 hr ago' : `${hrs} hrs ago`
}

export function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${num}`
}

export const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'preparing',
  'served',
  'payment_received',
]

export function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[idx + 1]
}

export function statusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    preparing: 'Preparing',
    served: 'Served',
    payment_received: 'Payment Received',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function statusEmoji(status: OrderStatus): string {
  const emojis: Record<OrderStatus, string> = {
    pending: '🟡',
    preparing: '🔵',
    served: '🟢',
    payment_received: '✅',
    cancelled: '🔴',
  }
  return emojis[status]
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  served: 'bg-green-100 text-green-800',
  payment_received: 'bg-teal-100 text-teal-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const FILTER_STATUSES = [
  'all',
  'pending',
  'preparing',
  'served',
  'payment_received',
  'cancelled',
] as const

export type StatusFilter = (typeof FILTER_STATUSES)[number]
