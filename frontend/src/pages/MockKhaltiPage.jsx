import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Wallet, AlertTriangle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Seo from '../components/common/Seo'
import { orderApi, paymentApi } from '../services/api'

function MockKhaltiPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const pidx = searchParams.get('pidx')
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!orderId)
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) return
    let mounted = true
    orderApi
      .getOrderById(orderId)
      .then((data) => {
        if (mounted) {
          setOrder(data.order)
          setError('')
        }
      })
      .catch((err) => {
        if (mounted) {
          setOrder(null)
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [orderId])

  const handlePay = async () => {
    if (!pidx) {
      setError('Missing payment reference.')
      return
    }
    setPhase('processing')
    setError('')
    try {
      const res = await paymentApi.verifyKhalti(pidx)
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
    } catch (err) {
      setError(err.message)
      setPhase('failed')
    }
  }

  const handleCancel = () => {
    navigate('/orders', { replace: true })
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-orange-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Session Unavailable</h1>
        <p className="mt-2 text-gray-600">{error || 'This payment link is invalid or expired.'}</p>
        <Link
          to="/orders"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          View My Orders
        </Link>
      </div>
    )
  }

  const processing = phase === 'processing'

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Seo title="Sandbox Payment | 1Shop Nepal" description="Mock Khalti checkout for development." canonical="/payment/khalti/mock" noindex />
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="mt-4 bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">DEVELOPMENT SANDBOX — Not a real payment.</p>
          <p className="mt-0.5 text-amber-700">
            Khalti is not configured for this environment. This page simulates the Khalti checkout
            so you can test the full payment flow. No money is charged.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-[#5C2D91] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Wallet className="w-6 h-6" />
            <div>
              <p className="font-bold leading-tight">Khalti</p>
              <p className="text-xs text-purple-200">Development Mock Checkout</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-purple-200 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
            Sandbox
          </span>
        </div>

        <div className="p-6">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Merchant</span>
            <span className="font-medium text-gray-900">1ShopNepal</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Order</span>
            <span className="font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-700">
                <span>{item.name}</span>
                <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium">
                {order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost.toLocaleString()}`}
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
          )}

          <button
            onClick={handlePay}
            disabled={processing}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5C2D91] text-white font-semibold rounded-lg hover:bg-[#4d2478] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Simulating payment...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Pay {order.totalAmount.toLocaleString()} (Simulate)
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={processing}
            className="mt-3 w-full px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel Payment
          </button>
          <p className="mt-3 text-center text-xs text-gray-400">
            This mock gateway never stores or transfers any money. It only works in development
            mode when no Khalti secret key is configured.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MockKhaltiPage