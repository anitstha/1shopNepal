import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import Seo from '../components/common/Seo'

function EsewaFailure() {
  const [searchParams] = useSearchParams()
  const data = searchParams.get('data')
  const [decoded] = useState(() => {
    if (!data) return null
    try {
      return JSON.parse(atob(data))
    } catch {
      return null
    }
  })

  const reason = decoded?.status === 'CANCELLED'
    ? 'The payment was cancelled in the eSewa window.'
    : decoded?.status && decoded.status !== 'COMPLETE'
      ? 'eSewa reported the payment as not completed.'
      : 'The payment did not go through.'

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <Seo title="Payment Failed | 1Shop Nepal" description="Your eSewa payment could not be completed." canonical="/payment/esewa/failure" noindex />
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="mt-5 text-3xl font-bold text-gray-900">Payment Not Completed</h1>
      <p className="mt-3 text-gray-600">{reason}</p>
      <p className="mt-2 text-sm text-gray-500">
        Your order was not charged. If you were charged, eSewa automatically refunds failed transactions.
      </p>

      {decoded && (
        <div className="mt-6 mx-auto max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs text-gray-600">
          <p className="font-semibold text-gray-900 mb-1.5">Details from eSewa</p>
          <p>Status: <span className="font-mono uppercase">{decoded.status || 'unknown'}</span></p>
          {decoded.total_amount != null && <p>Amount: <span className="font-mono">Rs. {decoded.total_amount}</span></p>}
          {decoded.transaction_uuid && (
            <p className="truncate">Transaction: <span className="font-mono">{decoded.transaction_uuid}</span></p>
          )}
          {decoded.message && <p>Message: <span className="font-mono">{decoded.message}</span></p>}
        </div>
      )}
      {!data && (
        <p className="mt-4 text-xs text-gray-400">No response data was received from eSewa.</p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/checkout"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          <ArrowLeft className="w-5 h-5" /> Try Again
        </Link>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 px-6 py-3 text-orange-600 font-semibold border border-orange-600 rounded-lg hover:bg-orange-50"
        >
          <ShoppingCart className="w-5 h-5" /> View Cart
        </Link>
      </div>
    </div>
  )
}

export default EsewaFailure