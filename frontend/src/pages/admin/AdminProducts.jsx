import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, Check, X } from 'lucide-react'
import { productApi } from '../../services/api'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stockEditId, setStockEditId] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [savingStock, setSavingStock] = useState(false)

  useEffect(() => {
    let mounted = true
    productApi
      .getProducts({ page, limit: 10 })
      .then((res) => {
        if (mounted) {
          setProducts(res.products)
          setTotal(res.total)
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [page])

  const reload = () => {
    setLoading(true)
    productApi
      .getProducts({ page, limit: 10 })
      .then((res) => {
        setProducts(res.products)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const startStockEdit = (p) => {
    setStockEditId(p._id)
    setStockValue(String(p.stock ?? 0))
    setError('')
  }

  const cancelStockEdit = () => {
    setStockEditId(null)
    setStockValue('')
  }

  const saveStock = async (id) => {
    const next = Number(stockValue)
    if (!Number.isInteger(next) || next < 0) {
      return setError('Stock must be a whole number of 0 or more')
    }
    setSavingStock(true)
    setError('')
    try {
      await productApi.updateProduct(id, { stock: next })
      cancelStockEdit()
      reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingStock(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"? This cannot be undone.`)) return
    try {
      await productApi.deleteProduct(id)
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const pages = Math.ceil(total / 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">Create, edit and manage stock.</p>
        </div>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-4 h-4" /> New Product
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm mt-1">Create your first product to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200" />
                          )}
                          <span className="font-medium text-gray-900 line-clamp-1 max-w-[220px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.category?.name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          Rs. {Number(p.price || 0).toLocaleString()}
                        </span>
                        {p.discountPrice ? (
                          <span className="ml-2 text-xs text-green-600 line-through">
                            {Number(p.discountPrice).toLocaleString()}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {stockEditId === p._id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={stockValue}
                              autoFocus
                              onChange={(e) => setStockValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveStock(p._id)
                                if (e.key === 'Escape') cancelStockEdit()
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                              onClick={() => saveStock(p._id)}
                              disabled={savingStock}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                              aria-label="Save stock"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelStockEdit}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                              aria-label="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startStockEdit(p)}
                            title="Click to update stock"
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              Number(p.stock) > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {Number(p.stock) > 0 ? `In stock (${p.stock})` : 'Out of stock'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-2 text-gray-500 hover:text-orange-600"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminProducts