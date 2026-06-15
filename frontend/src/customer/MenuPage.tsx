import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/products'
import type { CartLine, Product, ProductCategory } from '../types'
import { formatPrice } from '../utils/format'
import { ProductCard } from './ProductCard'
import { CartDrawer } from './CartDrawer'

interface MenuPageProps {
  tableNumber: number
  products: Product[]
  cart: CartLine[]
  onAddToCart: (productId: string) => void
  onUpdateQty: (productId: string, delta: number) => void
  onPlaceOrder: (note: string) => void
}

export function MenuPage({
  tableNumber,
  products,
  cart,
  onAddToCart,
  onUpdateQty,
  onPlaceOrder,
}: MenuPageProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory>('All')
  const [cartOpen, setCartOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, category, products])

  const cartCount = cart.reduce((s, l) => s + l.qty, 0)
  const cartTotal = cart.reduce((s, l) => {
    const p = products.find((pr) => pr.id === l.productId)
    return s + (p?.price ?? 0) * l.qty
  }, 0)

  const getQty = (id: string) => cart.find((l) => l.productId === id)?.qty ?? 0

  return (
    <div className="min-h-dvh bg-cream pb-24">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <span className="font-display text-lg font-bold text-espresso">Brew & Bean</span>
        </div>
        <span className="rounded-full bg-amber-light text-espresso text-xs font-semibold px-3 py-1.5">
          📍 Table {tableNumber}
        </span>
      </header>

      <div className="sticky top-[52px] z-20 bg-cream px-4 pb-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for coffee, snacks…"
            className="w-full rounded-xl bg-white shadow-sm pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-amber text-white shadow-sm'
                  : 'bg-white text-espresso/70 shadow-sm hover:bg-amber-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {filtered.length === 0 ? (
          <p className="text-center text-espresso/50 py-12">
            No items found for &lsquo;{search}&rsquo; — try something else ☕
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={getQty(product.id)}
                onAdd={() => onAddToCart(product.id)}
                onIncrement={() => onUpdateQty(product.id, 1)}
                onDecrement={() => onUpdateQty(product.id, -1)}
              />
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-4 right-4 z-30 flex items-center justify-center gap-2 rounded-2xl bg-espresso text-cream py-4 font-semibold shadow-xl hover:bg-espresso/90 transition-colors animate-fade-in"
        >
          🛒 View Order ({cartCount} item{cartCount !== 1 ? 's' : ''} · {formatPrice(cartTotal)})
        </button>
      )}

      <CartDrawer
        open={cartOpen}
        products={products}
        cart={cart}
        tableNumber={tableNumber}
        onClose={() => setCartOpen(false)}
        onUpdateQty={onUpdateQty}
        onConfirm={(note) => {
          onPlaceOrder(note)
          setCartOpen(false)
        }}
      />
    </div>
  )
}
