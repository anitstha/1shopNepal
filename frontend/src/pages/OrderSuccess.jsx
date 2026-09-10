import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CheckCircle2, Package, Banknote, Loader2 } from 'lucide-react'
import Seo from '../components/common/Seo'
import { orderApi } from '../services/api'
import StatusBadge from '../components/orders/StatusBadge'

const PAYMENT_METHOD_LABELS = {
  cod: 'Cash on Delivery',
  esewa: 'eSewa',
}

function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!orderId)
  const successToastFired = useRef(false)

  useEffect(() => {
    if (!orderId) return
    let mounted = true
    orderApi
      .getOrderById(orderId)
      .then((data) => {
        if (mounted) setOrder(data.order)
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [orderId])

  useEffect(() => {
    if (order && !successToastFired.current) {
      successToastFired.current = true
      toast.success(`Order #${order._id.slice(-8).toUpperCase()} placed successfully!`)
    }
  }, [order])

  const shortId = order?._id || orderId
  const shortened = shortId ? shortId.slice(-8).toUpperCase() : ''

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo title="Order Placed | 1Shop Nepal" description="Your 1Shop Nepal order was placed successfully." canonical="/order-success" noindex />
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-gray-600">
          Thank you for shopping with 1ShopNepal.
          {order && (
            <>
              {' '}We have received your order{' '}
              <span className="font-semibold text-gray-900">#{shortened}</span>.
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
      ) : order ? (
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Order #{shortened}
                </p>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  {item.name}
                  <span className="text-gray-400"> × {item.quantity}</span>
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
              <p className="text-sm font-medium text-gray-900">
                {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
              </p>
              <p className="text-xs text-gray-500">
                {order.paymentMethod === 'cod'
                  ? `Please keep Rs. ${order.totalAmount.toLocaleString()} ready when the order arrives.`
                  : 'Payment completed online. Your order will be processed shortly.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 text-center text-gray-500">
          <p>Your order details could not be loaded.</p>
        </div>
      )}

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

export default OrderSuccess