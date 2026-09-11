import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader2, Trash2, Star, Search } from 'lucide-react'
import { adminApi, reviewApi } from '../../services/api'
import StarRating from '../../components/reviews/StarRating'

function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let mounted = true
    adminApi
      .getReviews({ page, limit: 20, search })
      .then((res) => {
        if (!mounted) return
        setReviews(res.reviews)
        setPages(res.pages)
        setTotal(res.total)
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
  }, [page, search])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return
    setDeletingId(id)
    setError('')
    try {
      await reviewApi.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r._id !== id))
      setTotal((t) => Math.max(0, t - 1))
      toast.success('Review deleted')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="mt-1 text-gray-600">Moderate customer reviews.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={submitSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search review comments"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </form>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 ${
                  deletingId === r._id ? 'opacity-50' : ''
                }`}
              >
                {r.product?.images?.[0] ? (
                  <img
                    src={r.product.images[0]}
                    alt={r.product.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Link
                      to={`/products/${r.product?._id}`}
                      className="font-semibold text-gray-900 hover:text-orange-600 line-clamp-1"
                    >
                      {r.product?.name || 'Deleted product'}
                    </Link>
                    <span className="inline-flex items-center text-xs text-amber-500 font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" /> {r.rating}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                    <StarRating value={r.rating} size="w-3.5 h-3.5" />
                    <span className="capitalize">{r.user?.name || 'Unknown user'}</span>
                    <span>•</span>
                    <span>
                      {new Date(r.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                      {r.comment}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col sm:justify-center justify-end gap-2">
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={deletingId === r._id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    {deletingId === r._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {pages} ({total} reviews)
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
        </>
      )}
    </div>
  )
}

export default AdminReviews