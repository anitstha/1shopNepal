import { useState } from 'react'
import { toast } from 'react-toastify'
import { Star, Loader2 } from 'lucide-react'
import StarRating from './StarRating'

function ReviewForm({ initialRating = 5, initialComment = '', onSubmit, submitLabel = 'Submit Review' }) {
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) {
      setError('Please select a rating')
      toast.error('Please select a rating')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ rating, comment: comment.trim() })
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialComment ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
        <div className="flex items-center gap-2">
          <StarRating
            interactive
            value={rating}
            onSelect={setRating}
            size="w-6 h-6"
          />
          <span className="text-sm font-medium text-gray-700">{rating}.0</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="text-sm font-medium text-gray-700">
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your thoughts about this product..."
          className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
          </>
        ) : initialComment ? 'Update Review' : submitLabel}
      </button>
    </form>
  )
}

export default ReviewForm