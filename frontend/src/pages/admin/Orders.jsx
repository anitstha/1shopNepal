import useDocumentTitle from "../../hooks/useDocumentTitle";
import { ORDER_STATUSES, useOrders } from "../../context/OrderContext";
import { formatPrice } from "../../utils/format";

/** Maps order status to badge colors. */
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  useDocumentTitle("Manage Orders");
  const { orders, updateOrderStatus } = useOrders();

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-4 py-4 font-semibold">Customer</th>
              <th className="px-4 py-4 font-semibold">Items</th>
              <th className="px-4 py-4 font-semibold">Total</th>
              <th className="px-4 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <p className="font-bold text-neutral-900">{order.id}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(order.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-neutral-900">{order.customer.name}</p>
                  <p className="text-xs text-neutral-400">
                    {order.customer.phone} · {order.customer.city}
                  </p>
                </td>
                <td className="px-4 py-4 text-xs text-neutral-500">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.qty} × {item.name}
                    </p>
                  ))}
                </td>
                <td className="px-4 py-4 font-bold">{formatPrice(order.total)}</td>
                <td className="px-4 py-4">
                  {/* Status dropdown — admins can move orders along */}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    aria-label={`Update status for ${order.id}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize outline-none ${STATUS_STYLES[order.status]}`}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status} className="bg-white font-medium normal-case">
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-400">
                  No orders have been placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
