export type ProductCategory =
  | 'All'
  | 'Coffee'
  | 'Cold Drinks'
  | 'Snacks'
  | 'Desserts'
  | 'Food'

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'served'
  | 'payment_received'
  | 'cancelled'

export interface Product {
  id: string
  name: string
  category: Exclude<ProductCategory, 'All'>
  description: string
  price: number
  image: string
}

export interface OrderItem {
  productId: string
  name: string
  qty: number
  price: number
}

export interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  note: string
  status: OrderStatus
  placedAt: string
}

export interface CartLine {
  productId: string
  qty: number
}

export type AppView = 'customer' | 'admin'

export interface ToastMessage {
  id: string
  text: string
  icon?: string
}
