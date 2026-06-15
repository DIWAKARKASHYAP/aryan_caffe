import { X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ToastContainer() {
  const { toasts, dismissToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in-right flex items-center gap-2 rounded-xl bg-espresso text-cream px-4 py-3 shadow-lg"
        >
          {toast.icon && <span>{toast.icon}</span>}
          <p className="flex-1 text-sm font-medium">{toast.text}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-cream/60 hover:text-cream"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
