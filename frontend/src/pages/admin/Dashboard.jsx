import { Link } from "react-router-dom";
import { ArrowUpRight, DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useCatalog } from "../../context/CatalogContext";
import { useOrders } from "../../context/OrderContext";
import { formatPrice } from "../../utils/format";

const Dashboard = () => {
  useDocumentTitle("Admin Dashboard");
  const { products } = useCatalog();
  const { orders } = useOrders();

  // ---- Derived stats ----
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Small cards shown at the top of the page
  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "bg-emerald-500" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Pending Orders", value: pendingOrders, icon: TrendingUp, color: "bg-amber-500" },
    { label: "Products", value: products.length, icon: Package, color: "bg-violet-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight text-neutral-950">Dashboard</h1>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{stat.label}</p>
                <p className="truncate text-lg font-black text-neutral-950">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Recent orders */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-neutral-950">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{order.id}</p>
                    <p className="text-xs text-neutral-400">
                      {order.customer.name} · {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs font-semibold capitalize text-neutral-400">{order.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Low stock alert */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-neutral-950">Low Stock Alert</h2>

          {lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {lowStockProducts.slice(0, 5).map((product) => (
                <li key={product.id} className="flex items-center gap-3 py-3">
                  <img src={product.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <Link to={`/admin/products/edit/${product.id}`} className="min-w-0 flex-1 truncate text-xs font-semibold hover:underline">
                    {product.name}
                  </Link>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${product.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                    {product.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
