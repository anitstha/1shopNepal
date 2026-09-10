import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CheckCircle2, XCircle, Loader2, Package, Banknote } from 'lucide-react'
import Seo from '../components/common/Seo'
import { paymentApi } from '../services/api'
import { useCart } from '../context/CartContext'
import StatusBadge from '../components/orders/StatusBadge'

function EsewaSuccess() {
  const [searchParams] = useSearchParams()
  const data = searchParams.get('data')
  const { clearCart } = useCart()
  const [state, setState] = useState('verifying')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const firedToast = useRef(false)

  useEffect(() => {
    if (!data) return

    let mounted = true
    paymentApi
      .verifyEsewa({ data })
      .then(async (res) => {
        if (!mounted) return
        setOrder(res.order)
        setState('verified')
        await clearCart().catch(() => {})
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message)
        setState('error')
      })
    return () => {
      mounted = false
    }
  }, [data, clearCart])

  useEffect(() => {
    if (state === 'verified' && order && !firedToast.current) {
      firedToast.current = true
      toast.success('Payment successful!')
    }
  }, [state, order])

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Seo title="Payment Not Verified | 1Shop Nepal" description="Your eSewa payment could not be verified." canonical="/payment/esewa/success" noindex />
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-gray-900">Payment Could Not Be Verified</h1>
        <p className="mt-3 text-gray-600">Missing eSewa payment data.</p>
        <p className="mt-2 text-sm text-gray-500">
          If money was deducted, do not worry — it will be refunded by eSewa automatically for failed transactions.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            View My Orders
          </Link>
          <Link
            to="/cart"
            className="inline-block px-6 py-3 text-orange-600 font-semibold border border-orange-600 rounded-lg hover:bg-orange-50"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    )
  }

  if (state === 'verified' && order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Seo title="Payment Successful | 1Shop Nepal" description="Your eSewa payment was successful." canonical="/payment/esewa/success" noindex />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your payment has been verified and your order is confirmed.
          </p>
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">
                  Paid via eSewa on{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.orderStatus} />
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-900">
                {order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-base">
              <span>Total</span>
              <span>Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Banknote className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">eSewa</p>
              <p className="text-xs text-gray-500">
                Payment received. Your order will be processed shortly.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="inline-block px-6 py-3 text-orange-600 font-semibold border border-orange-600 rounded-lg hover:bg-orange-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (state === 'verifying') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Seo title="Verifying Payment | 1Shop Nepal" description="Verifying your eSewa payment." canonical="/payment/esewa/success" noindex />
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Verifying your payment...</h1>
        <p className="mt-2 text-gray-600">
          Please wait while we confirm your transaction with eSewa.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <Seo title="Payment Not Verified | 1Shop Nepal" description="Your eSewa payment could not be verified." canonical="/payment/esewa/success" noindex />
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
        <XCircle className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="mt-5 text-3xl font-bold text-gray-900">Payment Could Not Be Verified</h1>
      <p className="mt-3 text-gray-600">{error || 'Something went wrong while verifying your payment.'}</p>
      <p className="mt-2 text-sm text-gray-500">
        If money was deducted, do not worry — it will be refunded by eSewa automatically for failed transactions.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/orders"
          className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          View My Orders
        </Link>
        <Link
          to="/cart"
          className="inline-block px-6 py-3 text-orange-600 font-semibold border border-orange-600 rounded-lg hover:bg-orange-50"
        >
          Go to Cart
        </Link>
      </div>
    </div>
  )
}

export default EsewaSuccess