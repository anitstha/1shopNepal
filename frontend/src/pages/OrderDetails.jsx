import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Package, MapPin, Banknote, Wallet, Loader2, ArrowLeft, Truck, AlertTriangle } from 'lucide-react'
import Seo from '../components/common/Seo'
import { orderApi } from '../services/api'
import StatusBadge from '../components/orders/StatusBadge'

const PAYMENT_METHOD_LABELS = {
  cod: 'Cash on Delivery',
  esewa: 'eSewa',
  khalti: 'Khalti',
  bank: 'Bank Transfer',
}

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    orderApi
      .getOrderById(id)
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
  }, [id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-600 mx-auto" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Seo title="Order Not Found | 1Shop Nepal" description="The order could not be found." canonical="/orders" noindex />
        <Package className="w-12 h-12 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Not Found</h1>
        <p className="mt-2 text-gray-600">{error || 'This order does not exist.'}</p>
        <Link
          to="/orders"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          Back to My Orders
        </Link>
      </div>
    )
  }

  const billing = order.shippingAddress
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo title="Order Details | 1Shop Nepal" description={`Review order ${order._id.slice(-8).toUpperCase()} at 1Shop Nepal.`} canonical={`/orders/${order._id}`} noindex />
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-gray-600">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            • {itemCount} item{itemCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentStatus} type="payment" />
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Ordered Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-medium text-gray-900 hover:text-orange-600 line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Rs. {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4 space-y-2.5 text-sm">
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
              <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-base">
                <span>Grand Total</span>
                <span>Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
            </div>
            {billing && (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">{billing.fullName}</p>
                <p>{billing.phone}</p>
                <p>{billing.addressLine}</p>
                <p>
                  {billing.city}
                  {billing.district ? `, ${billing.district}` : ''}
                  {billing.zipCode ? ` — ${billing.zipCode}` : ''}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Payment</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              {order.paymentMethod === 'khalti' ? (
                <Wallet className="w-4 h-4 text-[#5C2D91]" />
              ) : (
                <Banknote className="w-4 h-4 text-gray-500" />
              )}
              {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
              {order.isMockPayment && (
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 rounded px-2 py-0.5 uppercase tracking-wide">
                  Sandbox
                </span>
              )}
            </div>
            {order.transactionId && (
              <p className="mt-1.5 text-xs text-gray-500">
                Transaction ID: <span className="font-mono">{order.transactionId}</span>
                {order.isMockPayment && (
                  <span> (mock)</span>
                )}
              </p>
            )}
            {order.isMockPayment && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Paid through the <strong>development sandbox</strong> mock Khalti gateway. No real
                  money was charged.
                </p>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">Payment Status</span>
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500">Order Status</span>
              <StatusBadge status={order.orderStatus} />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-start gap-3">
            <Truck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold">Track your delivery</p>
              <p className="mt-0.5 text-orange-700">
                Your order is{' '}
                <span className="capitalize font-medium">{order.orderStatus}</span>. We'll keep you
                updated as it moves to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails