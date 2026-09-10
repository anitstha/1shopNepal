import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, Loader2, X, Check, Save } from 'lucide-react'
import { categoryApi } from '../../services/api'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', image: '' })

  useEffect(() => {
    let mounted = true
    categoryApi
      .getCategories()
      .then((res) => {
        if (mounted) setCategories(res.categories)
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
  }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Category name is required')
    setSubmitting(true)
    setError('')
    try {
      const res = await categoryApi.createCategory(form)
      setCategories((prev) => [res.category, ...prev])
      setForm({ name: '', description: '', image: '' })
      toast.success('Category created')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat._id)
    setEditForm({ name: cat.name, description: cat.description || '', image: cat.image || '' })
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', description: '', image: '' })
  }

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) return setError('Category name is required')
    setSubmitting(true)
    try {
      const res = await categoryApi.updateCategory(editingId, editForm)
      setCategories((prev) => prev.map((c) => (c._id === editingId ? res.category : c)))
      cancelEdit()
      toast.success('Category updated')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category won't be deleted.`)) return
    try {
      await categoryApi.deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c._id !== id))
      toast.success(`Category "${name}" deleted`)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    }
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-1 text-gray-600">Manage product categories.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border border-gray-200 p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
      >
        <div className="sm:col-span-2">
          <label className={labelCls}>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputCls}
            placeholder="e.g. Electronics"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputCls}
            placeholder="Optional"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelCls}>Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className={inputCls}
            placeholder="https://..."
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Category
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium">No categories yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Products</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) =>
                editingId === cat._id ? (
                  <tr key={cat._id} className="bg-orange-50">
                    <td className="px-4 py-3" colSpan={4}>
                      <div className="grid gap-3 sm:grid-cols-2 items-end">
                        <div>
                          <label className={labelCls}>Name</label>
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className={`${inputCls} bg-white`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Image URL</label>
                          <input
                            value={editForm.image}
                            onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                            className={`${inputCls} bg-white`}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Description</label>
                          <input
                            value={editForm.description}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            className={`${inputCls} bg-white`}
                          />
                        </div>
                        <div className="flex gap-2 sm:col-span-2 justify-end">
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={submitting}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200" />
                        )}
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{cat.productCount || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-2 text-gray-500 hover:text-orange-600"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-2 text-gray-500 hover:text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories