import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react'
import Seo from '../components/common/Seo'
import { paymentApi } from '../services/api'

function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const pidx = searchParams.get('pidx')
  const orderId = searchParams.get('orderId')
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!pidx) return
    let mounted = true
    paymentApi
      .verifyKhalti(pidx)
      .then((res) => {
        if (mounted) {
          navigate(
            '/order-success',
            {
              state: {
                orderId: res.order?._id || orderId,
                paymentMethod: 'khalti',
                isMock: res.isMock,
              },
              replace: true,
            }
          )
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
    return () => {
      mounted = false
    }
  }, [pidx, orderId, navigate])

  if (!pidx) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Missing Payment Reference</h1>
        <p className="mt-2 text-gray-600">
          We could not verify your payment because the payment reference is missing.
        </p>
        <Link
          to="/orders"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          View My Orders
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Could Not Be Confirmed</h1>
        <p className="mt-2 text-gray-600">{error}</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            <RotateCcw className="w-4 h-4" /> Retry Verification
          </button>
          <Link
            to={`/orders/${orderId || ''}`}
            className="inline-flex items-center px-6 py-3 text-orange-600 font-semibold border border-orange-600 rounded-lg hover:bg-orange-50"
          >
            View Order
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          If payment was deducted but the status is pending, our team will verify it manually.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Seo title="Payment Confirmation | 1Shop Nepal" description="Confirming your Khalti payment at 1Shop Nepal." canonical="/payment/khalti/callback" noindex />
      <Loader2 className="w-12 h-12 mx-auto animate-spin text-orange-600" />
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Confirming Your Payment...</h1>
      <p className="mt-2 text-gray-600">
        Verifying your Khalti payment with our server. Please wait.
      </p>
    </div>
  )
}

export default PaymentCallback