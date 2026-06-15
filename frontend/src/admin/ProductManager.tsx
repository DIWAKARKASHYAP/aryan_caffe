import { useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/products'
import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import { fileToDataUrl } from '../utils/image'
import type { ProductFormData } from '../api/client'

const PRODUCT_CATEGORIES = CATEGORIES.filter((c) => c !== 'All') as Product['category'][]

const emptyForm: ProductFormData = {
  name: '',
  category: 'Coffee',
  description: '',
  price: 0,
  image: '',
}

interface ProductFormModalProps {
  product?: Product
  onClose: () => void
  onSave: (data: ProductFormData, id?: string) => Promise<void>
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name,
          category: product.category,
          description: product.description,
          price: product.price,
          image: product.image,
        }
      : emptyForm,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((f) => ({ ...f, image: dataUrl }))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (!form.image) {
      setError('Please upload an image')
      return
    }
    if (form.price <= 0) {
      setError('Price must be greater than 0')
      return
    }
    setSaving(true)
    try {
      await onSave(form, product?.id)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-espresso/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl p-6 max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-2xl animate-fade-in"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-espresso">
            {product ? 'Edit Product' : 'Add Product'}
          </h3>
          <button type="button" onClick={onClose} className="text-espresso/40 hover:text-espresso">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-espresso/60 uppercase">Image</span>
            <div className="mt-1 flex items-center gap-3">
              {form.image ? (
                <img src={form.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-cream flex items-center justify-center text-2xl">
                  ☕
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-espresso/70 file:mr-2 file:rounded-lg file:border-0 file:bg-amber file:text-white file:px-3 file:py-1.5 file:text-sm file:font-semibold"
              />
            </div>
            <p className="text-[10px] text-espresso/40 mt-1">Stored in MongoDB · max 3MB</p>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-espresso/60 uppercase">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-espresso/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
              placeholder="Cappuccino"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-espresso/60 uppercase">Category</span>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as Product['category'] }))
              }
              className="mt-1 w-full rounded-xl border border-espresso/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-espresso/60 uppercase">Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-espresso/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
              placeholder="Short description"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-espresso/60 uppercase">Price (₹)</span>
            <input
              type="number"
              min={1}
              value={form.price || ''}
              onChange={(e) => setForm((f) => ({ ...f, price: parseInt(e.target.value, 10) || 0 }))}
              className="mt-1 w-full rounded-xl border border-espresso/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber/30"
            />
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-espresso text-cream py-3 font-semibold hover:bg-espresso/90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function ProductManager() {
  const { products, createProduct, updateProduct, deleteProduct } = useApp()
  const [modal, setModal] = useState<'create' | Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null)

  const handleSave = async (data: ProductFormData, id?: string) => {
    if (id) await updateProduct(id, data)
    else await createProduct(data)
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    await deleteProduct(deleteConfirm.id)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-espresso/60">{products.length} products in menu</p>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-1.5 rounded-xl bg-amber text-white font-semibold px-4 py-2.5 hover:bg-amber/90"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-espresso/50">
          <span className="text-4xl">🍽️</span>
          <p className="mt-2">No products yet. Add your first menu item.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white shadow-md overflow-hidden flex gap-3 p-3"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-espresso truncate">{product.name}</p>
                <p className="text-xs text-espresso/50">{product.category}</p>
                <p className="text-amber font-bold text-sm mt-0.5">{formatPrice(product.price)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setModal(product)}
                    className="flex items-center gap-1 text-xs font-semibold text-espresso/70 hover:text-amber"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <ProductFormModal onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal && modal !== 'create' && (
        <ProductFormModal product={modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-espresso/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="font-display text-lg font-bold mb-2">Delete {deleteConfirm.name}?</h3>
            <p className="text-sm text-espresso/60 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border py-2.5 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 text-white py-2.5 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
