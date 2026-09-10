import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MessageSquare, Loader2 } from 'lucide-react'
import { reviewApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

function ReviewsSection({ product, onProductUpdate }) {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingReview, setEditingReview] = useState(null)

  const fetchReviews = useCallback(
    () => reviewApi.getProductReviews(product._id),
    [product._id]
  )

  useEffect(() => {
    let mounted = true
    fetchReviews()
      .then((data) => {
        if (mounted) setReviews(data.reviews)
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
  }, [fetchReviews])

  const ownReview = reviews.find((r) => r.user?._id === user?._id)

  const reload = async () => {
    const data = await fetchReviews()
    setReviews(data.reviews)
  }

  const handleSubmit = async (data) => {
    await reviewApi.createReview(product._id, data)
    setEditingReview(null)
    await reload()
    await onProductUpdate()
    toast.success('Thanks! Your review has been published.')
  }

  const handleUpdate = async (data) => {
    await reviewApi.updateReview(editingReview._id, data)
    setEditingReview(null)
    await reload()
    await onProductUpdate()
    toast.success('Review updated successfully.')
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await reviewApi.deleteReview(review._id)
      setEditingReview(null)
      await reload()
      await onProductUpdate()
      toast.success('Review deleted.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const rating = Number(product.rating || 0)

  return (
    <div className="mt-12" id="reviews">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-gray-900">
              {product.reviewCount > 0 ? rating.toFixed(1) : 'New'}
            </p>
            <div className="flex justify-center mt-2">
              <StarRating rating={rating} size="w-5 h-5" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {product.reviewCount
                ? `${product.reviewCount} review${product.reviewCount > 1 ? 's' : ''}`
                : 'No reviews yet'}
            </p>
          </div>

          {isAuthenticated ? (
            ownReview && !editingReview ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm text-green-800">
                  You already reviewed this product.
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Your current rating: {ownReview.rating}.0
                </p>
              </div>
            ) : (
              <ReviewForm
                key={editingReview?._id || 'new'}
                initialRating={editingReview?.rating || 5}
                initialComment={editingReview?.comment || ''}
                onSubmit={editingReview ? handleUpdate : handleSubmit}
              />
            )
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Sign in to write a review for this product.
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <p className="text-center py-10 text-sm text-red-600">{error}</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300 mb-3" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  review={review}
                  isOwner={user?._id === review.user?._id}
                  isAdmin={user?.role === 'admin'}
                  onEdit={() => handleEdit(review)}
                  onDelete={() => handleDelete(review)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewsSection