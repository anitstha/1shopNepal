import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { productApi, categoryApi, uploadApi } from '../../services/api'

const EMPTY_FORM = {
  name: '',
  brand: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  category: '',
  specifications: '',
}

function ProductForm({ isEdit = false }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [cloudinaryStatus, setCloudinaryStatus] = useState({ checked: false, enabled: false })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => {})

    uploadApi
      .getConfig()
      .then((res) =>
        setCloudinaryStatus({ checked: true, enabled: res.cloudinaryConfigured })
      )
      .catch(() => setCloudinaryStatus({ checked: true, enabled: false }))
  }, [])

  useEffect(() => {
    if (!isEdit) return
    let mounted = true
    productApi
      .getProductById(id)
      .then((res) => {
        if (!mounted) return
        const p = res.product
        setForm({
          name: p.name || '',
          brand: p.brand || '',
          description: p.description || '',
          price: p.price ?? '',
          discountPrice: p.discountPrice ?? '',
          stock: p.stock ?? '',
          category: p.category?._id || '',
          specifications: p.specifications ? JSON.stringify(p.specifications, null, 2) : '',
        })
        setImageUrls(p.images || [])
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [isEdit, id])

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const addImageUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    setImageUrls((arr) => [...arr, url])
    setImageUrlInput('')
  }

  const removeImage = (index) =>
    setImageUrls((arr) => arr.filter((_, i) => i !== index))

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setError('')
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const valid = files.filter((f) => allowed.includes(f.type))
    const totalImages = selectedFiles.length + imageUrls.length + valid.length
    if (totalImages > 6) {
      setError('You can have up to 6 images per product')
      e.target.value = ''
      return
    }
    if (valid.length !== files.length) {
      setError('Only JPG, PNG, WEBP and GIF images are allowed')
    }
    setSelectedFiles((prev) => [...prev, ...valid])
    e.target.value = ''
  }

  const uploadSelected = async () => {
    if (selectedFiles.length === 0) return
    setUploading(true)
    setError('')
    try {
      const res = await uploadApi.uploadImages(selectedFiles)
      setImageUrls((prev) => [...prev, ...res.images])
      setSelectedFiles([])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const parseSpecs = () => {
    const raw = form.specifications.trim()
    if (!raw) return {}
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [k, String(v)])
        )
      }
      throw new Error('Specifications must be a JSON object')
    } catch (err) {
      setError(`Invalid specifications JSON: ${err.message}`)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) return setError('Product name is required')
    if (!form.price) return setError('Price is required')
    if (!form.category) return setError('Please select a category')

    const specs = parseSpecs()
    if (specs === null) return

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      description: form.description.trim() || undefined,
      price: Number(form.price),
      discountPrice: form.discountPrice !== '' ? Number(form.discountPrice) : undefined,
      stock: form.stock !== '' ? Number(form.stock) : 0,
      category: form.category,
      images: imageUrls,
      specifications: specs,
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        await productApi.updateProduct(id, payload)
        setSuccess('Product updated successfully')
      } else {
        await productApi.createProduct(payload)
        setSuccess('Product created successfully')
        setForm(EMPTY_FORM)
        setImageUrls([])
      }
      setTimeout(() => navigate('/admin/products'), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Create Product'}
        </h1>
        <Link to="/admin/products" className="text-sm text-orange-600 hover:text-orange-700">
          Back to products
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <label className={labelCls}>Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputCls}
            placeholder="e.g. Wireless Headphones"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputCls}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Price (Rs.) *</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Discount Price</label>
            <input
              name="discountPrice"
              type="number"
              min="0"
              value={form.discountPrice}
              onChange={handleChange}
              className={inputCls}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className={labelCls}>Stock *</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Specifications (JSON object)</label>
          <textarea
            name="specifications"
            value={form.specifications}
            onChange={handleChange}
            rows="3"
            className={`${inputCls} font-mono text-xs`}
            placeholder='{"Color":"Black","Weight":"300g"}'
          />
        </div>

        <div>
          <label className={labelCls}>Product Images (up to 6)</label>

          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {cloudinaryStatus.checked && cloudinaryStatus.enabled ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-orange-600">
                <Upload className="w-4 h-4" />
                Choose image files
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
              {selectedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  {selectedFiles.map((f, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {f.name}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={uploadSelected}
                    disabled={uploading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className={`${inputCls} pl-9`}
                    placeholder="Paste an image URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg"
                >
                  Add URL
                </button>
              </div>
              {cloudinaryStatus.checked && (
                <p className="text-xs text-gray-500 mt-2">
                  Cloudinary is not configured — add images by URL. Configure Cloudinary to enable file uploads.
                </p>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default ProductForm
