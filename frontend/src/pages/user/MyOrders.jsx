import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package, User } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { formatPrice } from "../../utils/format";

/** Maps order status to badge colors. */
const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  useDocumentTitle("My Orders");
  const location = useLocation();
  const { user } = useAuth();
  const { orders } = useOrders();

  // Only show orders belonging to the logged-in user
  const myOrders = orders.filter((order) => order.userEmail === user?.email);

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={User}
          title="You are not logged in"
          description="Log in to see your order history."
        >
          <Link
            to="/login"
            state={{ from: "/my-orders" }}
            className="inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        My Orders
      </h1>

      {/* Success banner after placing an order */}
      {location.state?.placed && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" /> Order placed successfully! We will
          contact you shortly to confirm delivery.
        </p>
      )}

      <div className="mt-8 space-y-5">
        {myOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order it will appear here."
          >
            <Link
              to="/products"
              className="inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white"
            >
              Start Shopping
            </Link>
          </EmptyState>
        ) : (
          myOrders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{order.id}</p>
                  <p className="text-xs text-neutral-400">
                    Placed on{" "}
                    {new Date(order.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    STATUS_STYLES[order.status] ?? "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <ul className="mt-5 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.qty} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-xs font-bold">{formatPrice(item.price * item.qty)}</p>
                  </li>
                ))}
              </ul>

              {/* Totals + delivery info */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-4 text-sm">
                <p className="text-xs text-neutral-500">
                  Deliver to: {order.customer.address}, {order.customer.city}
                </p>
                <p className="font-bold text-neutral-950">Total: {formatPrice(order.total)}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default MyOrders;
