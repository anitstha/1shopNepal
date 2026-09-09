import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Loader2, ChevronRight } from 'lucide-react'
import Seo from '../components/common/Seo'
import { orderApi } from '../services/api'
import StatusBadge from '../components/orders/StatusBadge'

const PAYMENT_METHOD_LABELS = {
  cod: 'Cash on Delivery',
  esewa: 'eSewa',
  khalti: 'Khalti',
  bank: 'Bank Transfer',
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    orderApi
      .getMyOrders()
      .then((data) => {
        if (mounted) setOrders(data.orders)
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
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo title="My Orders | 1Shop Nepal" description="Track your 1Shop Nepal orders." canonical="/orders" noindex />
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-orange-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>
      <p className="mt-2 text-gray-600">
        Track and manage your order history.
      </p>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <Package className="w-14 h-14 mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">No Orders Yet</h2>
          <p className="mt-2 text-gray-600">
            When you place an order, it will appear here.
          </p>
          <Link
            to="/products"
            className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
            return (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="block bg-white rounded-2xl border border-gray-200 hover:border-orange-400 hover:shadow-sm transition-all p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      • {itemCount} item{itemCount > 1 ? 's' : ''} •{' '}
                      {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        Rs. {order.totalAmount.toLocaleString()}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusBadge status={order.orderStatus} />
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders