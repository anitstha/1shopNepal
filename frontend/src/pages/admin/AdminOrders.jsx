import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'
import { adminApi, orderApi } from '../../services/api'
import StatusBadge from '../../components/orders/StatusBadge'

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const ORDER_STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    let mounted = true
    adminApi
      .getOrders({ page, limit: 20, status, search })
      .then((res) => {
        if (!mounted) return
        setOrders(res.orders)
        setPages(res.pages)
        setTotal(res.total)
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
  }, [page, status, search])

  const getFlowStatuses = (current) => {
    if (current === 'cancelled') return ['cancelled']
    const currentIdx = ORDER_STATUS_FLOW.indexOf(current)
    const allowed = currentIdx >= 0 ? ORDER_STATUS_FLOW.slice(0, currentIdx + 1) : ORDER_STATUS_FLOW
    return [...allowed, 'cancelled']
  }

  const handleStatusChange = async (orderId, nextStatus) => {
    setUpdatingId(orderId)
    setError('')
    try {
      await orderApi.updateOrderStatus(orderId, { orderStatus: nextStatus })
      const res = await adminApi.getOrders({ page, limit: 20, status, search })
      setOrders(res.orders)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-gray-600">View and update customer orders.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by order ID, name or city"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          {['all', ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s)
                setPage(1)
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${
                status === s
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-600'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[840px]">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          to={`/orders/${o._id}`}
                          className="font-semibold text-orange-600 hover:text-orange-700"
                        >
                          #{o._id.slice(-8).toUpperCase()}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(o.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{o.user?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{o.shippingAddress?.city || ''}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {o.items.reduce((sum, it) => sum + it.quantity, 0)}{' '}
                        <span className="text-gray-400">({o.items.length} types)</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        Rs. {Number(o.totalAmount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.paymentStatus} type="payment" />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.orderStatus}
                          disabled={updatingId === o._id}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 capitalize"
                        >
                          {getFlowStatuses(o.orderStatus).map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {page} of {pages} ({total} orders)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminOrders