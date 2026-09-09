import { Pencil, Trash2, User as UserIcon } from 'lucide-react'
import StarRating from './StarRating'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function ReviewItem({ review, isOwner, isAdmin, onEdit, onDelete }) {
  const canModify = isOwner || isAdmin

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {review.user?.name || 'Anonymous User'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} />
              <span className="text-xs text-gray-500">{review.rating}.0</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
          {canModify && (
            <div className="flex items-center gap-1">
              {isOwner && (
                <button
                  onClick={onEdit}
                  aria-label="Edit review"
                  className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onDelete}
                aria-label="Delete review"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  )
}

export default ReviewItem