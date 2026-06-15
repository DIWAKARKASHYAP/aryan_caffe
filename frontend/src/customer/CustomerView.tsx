import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import type { CartLine } from '../types'
import { MenuPage } from './MenuPage'
import { OrderSuccess } from './OrderSuccess'
import { SplashScreen } from './SplashScreen'

interface CustomerViewProps {
  tableNumber: number
}

type Phase = 'splash' | 'menu' | 'success'

export function CustomerView({ tableNumber }: CustomerViewProps) {
  const { products, placeOrder, showToast } = useApp()
  const [phase, setPhase] = useState<Phase>('splash')
  const [cart, setCart] = useState<CartLine[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setPhase('menu'), 1000)
    return () => clearTimeout(timer)
  }, [])

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
        )
      }
      return [...prev, { productId, qty: 1 }]
    })
  }, [])

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + delta } : l,
        )
        .filter((l) => l.qty > 0),
    )
  }, [])

  const handlePlaceOrder = useCallback(
    async (note: string) => {
      try {
        await placeOrder(tableNumber, cart, note)
        showToast('Order placed successfully!', '✅')
        setPhase('success')
        setCart([])
        setTimeout(() => setPhase('menu'), 3000)
      } catch {
        showToast('Failed to place order. Is the server running?', '❌')
      }
    },
    [cart, placeOrder, showToast, tableNumber],
  )

  if (phase === 'splash') return <SplashScreen tableNumber={tableNumber} />
  if (phase === 'success') return <OrderSuccess tableNumber={tableNumber} />

  return (
    <MenuPage
      tableNumber={tableNumber}
      products={products}
      cart={cart}
      onAddToCart={addToCart}
      onUpdateQty={updateQty}
      onPlaceOrder={handlePlaceOrder}
    />
  )
}
