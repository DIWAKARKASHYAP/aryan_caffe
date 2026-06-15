import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import * as api from '../api/client'
import type { CartLine, Order, OrderStatus, Product, ToastMessage } from '../types'

const ADMIN_AUTH_KEY = 'brew-bean-admin-auth'

interface AppContextValue {
  products: Product[]
  orders: Order[]
  tables: number[]
  loading: boolean
  error: string | null
  placeOrder: (tableNumber: number, cart: CartLine[], note: string) => Promise<Order>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  cancelOrder: (orderId: string) => Promise<void>
  addTable: (tableNumber: number) => Promise<boolean>
  removeTable: (tableNumber: number) => Promise<void>
  toasts: ToastMessage[]
  showToast: (text: string, icon?: string) => void
  dismissToast: (id: string) => void
  isAdminAuthenticated: boolean
  loginAdmin: (password: string) => boolean
  logoutAdmin: () => void
  getProduct: (id: string) => Product | undefined
  refreshOrders: () => Promise<void>
  createProduct: (data: api.ProductFormData) => Promise<Product>
  updateProduct: (id: string, data: Partial<api.ProductFormData>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tables, setTables] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true',
  )
  const knownOrderIds = useRef(new Set<string>())

  const showToast = useCallback((text: string, icon?: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, text, icon }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const refreshOrders = useCallback(async () => {
    const data = await api.fetchOrders()
    const newOrders = data.filter((o) => !knownOrderIds.current.has(o.id))
    newOrders.forEach((o) => {
      knownOrderIds.current.add(o.id)
      showToast(`🔔 New order from Table ${o.tableNumber}!`, '🔔')
    })
    data.forEach((o) => knownOrderIds.current.add(o.id))
    setOrders(data)
  }, [showToast])

  useEffect(() => {
    async function load() {
      try {
        const [prods, ords, tbls] = await Promise.all([
          api.fetchProducts(),
          api.fetchOrders(),
          api.fetchTables(),
        ])
        setProducts(prods)
        setOrders(ords)
        setTables(tbls)
        ords.forEach((o) => knownOrderIds.current.add(o.id))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to server')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders().catch(() => {})
    }, 12000)
    return () => clearInterval(interval)
  }, [refreshOrders])

  const placeOrder = useCallback(
    async (tableNumber: number, cart: CartLine[], note: string): Promise<Order> => {
      const order = await api.createOrder(tableNumber, cart, note)
      knownOrderIds.current.add(order.id)
      setOrders((prev) => [order, ...prev])
      return order
    },
    [],
  )

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const updated = await api.updateOrderStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
      showToast(`Order ${orderId} → ${status.replace('_', ' ')}`, '✅')
    },
    [showToast],
  )

  const cancelOrder = useCallback(
    async (orderId: string) => {
      const updated = await api.updateOrderStatus(orderId, 'cancelled')
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
      showToast(`Order ${orderId} cancelled`, '🔴')
    },
    [showToast],
  )

  const addTable = useCallback(
    async (tableNumber: number): Promise<boolean> => {
      try {
        const updated = await api.addTable(tableNumber)
        setTables(updated)
        showToast(`QR generated for Table ${tableNumber}`, '📱')
        return true
      } catch {
        return false
      }
    },
    [showToast],
  )

  const removeTable = useCallback(
    async (tableNumber: number) => {
      const updated = await api.removeTable(tableNumber)
      setTables(updated)
      showToast(`Table ${tableNumber} removed`, '🗑️')
    },
    [showToast],
  )

  const loginAdmin = useCallback((password: string) => {
    if (password === 'admin123') {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
      setIsAdminAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    setIsAdminAuthenticated(false)
  }, [])

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const createProduct = useCallback(
    async (data: api.ProductFormData) => {
      const product = await api.createProduct(data)
      setProducts((prev) => [...prev, product].sort((a, b) => a.id.localeCompare(b.id)))
      showToast(`${product.name} added to menu`, '✅')
      return product
    },
    [showToast],
  )

  const updateProduct = useCallback(
    async (id: string, data: Partial<api.ProductFormData>) => {
      const product = await api.updateProduct(id, data)
      setProducts((prev) => prev.map((p) => (p.id === id ? product : p)))
      showToast(`${product.name} updated`, '✅')
      return product
    },
    [showToast],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showToast('Product removed from menu', '🗑️')
    },
    [showToast],
  )

  const value = useMemo(
    () => ({
      products,
      orders,
      tables,
      loading,
      error,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      addTable,
      removeTable,
      toasts,
      showToast,
      dismissToast,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      getProduct,
      refreshOrders,
      createProduct,
      updateProduct,
      deleteProduct,
    }),
    [
      products,
      orders,
      tables,
      loading,
      error,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      addTable,
      removeTable,
      toasts,
      showToast,
      dismissToast,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      getProduct,
      refreshOrders,
      createProduct,
      updateProduct,
      deleteProduct,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
