import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Package,
  ShoppingCart,
  Banknote,
  Loader2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { adminApi } from '../services/api'
import StatusBadge from '../components/orders/StatusBadge'

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    adminApi
      .getStats()
      .then((res) => {
        if (mounted) setData(res)
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

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 text-red-600">
        {error || 'Failed to load dashboard data'}
      </div>
    )
  }

  const { stats } = data

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-sky-600 bg-sky-100' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-orange-600 bg-orange-100' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-100' },
    { label: 'Total Revenue', value: `Rs. ${Number(stats.totalRevenue || 0).toLocaleString()}`, icon: Banknote, color: 'text-green-600 bg-green-100' },
  ]

  const maxStatus = Math.max(
    ...ORDER_STATUSES.map((s) => stats.orderStatusSummary?.[s] || 0),
    1
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your store's performance.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {card.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-5 sm:mx-0">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="px-5 py-2 font-medium">Order</th>
                    <th className="px-5 py-2 font-medium">Customer</th>
                    <th className="px-5 py-2 font-medium">Date</th>
                    <th className="px-5 py-2 font-medium">Total</th>
                    <th className="px-5 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{o.user?.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        Rs. {Number(o.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={o.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Summary</h2>
            <div className="space-y-3">
              {ORDER_STATUSES.map((status) => {
                const count = stats.orderStatusSummary?.[status] || 0
                const pct = Math.round((count / maxStatus) * 100)
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 capitalize">{status}</span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Best-Selling Products</h2>
            </div>
            {data.bestSellingProducts.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No sales data yet.</p>
            ) : (
              <div className="space-y-4">
                {data.bestSellingProducts.map((item, i) => (
                  <Link
                    key={item._id}
                    to={`/admin/products/edit/${item._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="w-6 text-center font-bold text-gray-400">{i + 1}</span>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.totalSold} sold • Rs. {Number(item.revenue).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard