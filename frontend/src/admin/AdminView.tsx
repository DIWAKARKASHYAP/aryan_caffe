import { useState } from 'react'
import { ClipboardList, Coffee, LogOut, QrCode } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AdminLogin } from './AdminLogin'
import { LiveOrders } from './LiveOrders'
import { ProductManager } from './ProductManager'
import { QrManager } from './QrManager'

type AdminTab = 'orders' | 'products' | 'qr'

const TAB_LABELS: Record<AdminTab, string> = {
  orders: '📋 Live Orders',
  products: '🍽️ Menu Products',
  qr: '🪑 QR Manager',
}

export function AdminView() {
  const { isAdminAuthenticated, logoutAdmin, orders } = useApp()
  const [tab, setTab] = useState<AdminTab>('orders')

  if (!isAdminAuthenticated) return <AdminLogin />

  const activeCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'served',
  ).length

  const navBtn = (id: AdminTab, icon: React.ReactNode, label: string, badge?: number) => (
    <button
      onClick={() => setTab(id)}
      className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        tab === id ? 'bg-cream/15' : 'hover:bg-cream/10'
      }`}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-amber text-white text-xs font-bold rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <div className="min-h-dvh bg-cream flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-56 bg-espresso text-cream p-5 shrink-0">
        <div className="mb-8">
          <span className="text-2xl">☕</span>
          <h1 className="font-display text-lg font-bold mt-1">Brew & Bean</h1>
          <p className="text-xs text-cream/60">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navBtn('orders', <ClipboardList size={18} />, 'Live Orders', activeCount)}
          {navBtn('products', <Coffee size={18} />, 'Menu Products')}
          {navBtn('qr', <QrCode size={18} />, 'QR Manager')}
        </nav>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 text-sm text-cream/60 hover:text-cream mt-4"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold text-espresso">{TAB_LABELS[tab]}</h1>
          <button onClick={logoutAdmin} className="text-espresso/50">
            <LogOut size={20} />
          </button>
        </div>

        <h2 className="hidden md:block font-display text-2xl font-bold text-espresso mb-5">
          {TAB_LABELS[tab]}
        </h2>

        {tab === 'orders' && <LiveOrders />}
        {tab === 'products' && <ProductManager />}
        {tab === 'qr' && <QrManager />}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-espresso/10 flex z-40">
        {(
          [
            { id: 'orders' as const, icon: ClipboardList, label: 'Orders', badge: activeCount },
            { id: 'products' as const, icon: Coffee, label: 'Menu' },
            { id: 'qr' as const, icon: QrCode, label: 'QR' },
          ] as const
        ).map((item) => {
          const { id, icon: Icon, label } = item
          const badge = 'badge' in item ? item.badge : undefined
          return (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium ${
              tab === id ? 'text-amber' : 'text-espresso/50'
            }`}
          >
            <Icon size={20} />
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="absolute top-1.5 ml-7 bg-amber text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
          )
        })}
      </nav>
    </div>
  )
}
