import type { CartLine, Order, OrderStatus, Product } from '../types'
import { BASE_API } from '../../global.js'

const API = import.meta.env.DEV ? '/api' : `${BASE_API}/api`

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`)
  }

  return res.json() as Promise<T>
}

export function fetchProducts(): Promise<Product[]> {
  return request<Product[]>(`${API}/products`)
}

export interface ProductFormData {
  name: string
  category: Product['category']
  description: string
  price: number
  image: string
}

export function createProduct(data: ProductFormData): Promise<Product> {
  return request<Product>(`${API}/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
  return request<Product>(`${API}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteProduct(id: string): Promise<{ ok: boolean; id: string }> {
  return request<{ ok: boolean; id: string }>(`${API}/products/${id}`, {
    method: 'DELETE',
  })
}

export function fetchOrders(): Promise<Order[]> {
  return request<Order[]>(`${API}/orders`)
}

export function createOrder(
  tableNumber: number,
  items: CartLine[],
  note: string,
): Promise<Order> {
  return request<Order>(`${API}/orders`, {
    method: 'POST',
    body: JSON.stringify({ tableNumber, items, note }),
  })
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  return request<Order>(`${API}/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function fetchTables(): Promise<number[]> {
  return request<number[]>(`${API}/tables`)
}

export function addTable(number: number): Promise<number[]> {
  return request<number[]>(`${API}/tables`, {
    method: 'POST',
    body: JSON.stringify({ number }),
  })
}

export function removeTable(number: number): Promise<number[]> {
  return request<number[]>(`${API}/tables/${number}`, { method: 'DELETE' })
}
