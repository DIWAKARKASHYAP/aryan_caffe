import { parseUrlParams } from './utils/url'
import { AppProvider, useApp } from './context/AppContext'
import { ToastContainer } from './components/ToastContainer'
import { CustomerView } from './customer/CustomerView'
import { AdminView } from './admin/AdminView'

function AppContent() {
  const { view, table } = parseUrlParams()
  const { loading, error } = useApp()

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-cream text-espresso/60">
        <p className="text-lg">Loading Brew & Bean…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-cream text-espresso px-6 text-center gap-3">
        <span className="text-4xl">☕</span>
        <p className="text-lg font-semibold">Could not connect to server</p>
        <p className="text-sm text-espresso/60">{error}</p>
        <p className="text-xs text-espresso/40 mt-2 max-w-sm">
          Check that the API is deployed at{' '}
          <code className="bg-white px-1 rounded">aryan-caffe-api.vercel.app</code> and
          redeploy the frontend after changing <code className="bg-white px-1 rounded">global.js</code>.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded-xl bg-espresso text-cream px-5 py-2.5 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return view === 'admin' ? <AdminView /> : <CustomerView tableNumber={table} />
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  )
}
