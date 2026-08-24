import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, ShoppingBag, Wallet } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../data/products";

/** Payment options offered at checkout (demo only). */
const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives", icon: Banknote },
  { id: "esewa", label: "eSewa", hint: "Digital wallet payment", icon: Wallet },
  { id: "khalti", label: "Khalti", hint: "Digital wallet payment", icon: Wallet },
];

const Checkout = () => {
  useDocumentTitle("Checkout");
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();

  // Pre-fill contact details when logged in
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Validates, creates the order and clears the cart. */
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please log in to place an order.");
      return;
    }
    if (!form.name || !form.phone || !form.city || !form.address) {
      setError("Please fill in all delivery details.");
      return;
    }

    placeOrder({
      items,
      subtotal,
      customer: {
        name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      },
      userEmail: user.email,
    });
    clearCart();

    // Show the success banner on the orders page
    navigate("/my-orders", { state: { placed: true } });
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Your cart is empty. Add some products first."
        >
          <Link
            to="/products"
            className="inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white"
          >
            Browse Products
          </Link>
        </EmptyState>
      </section>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Checkout
      </h1>

      {!user && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          You need to{" "}
          <Link to="/login" state={{ from: "/checkout" }} className="font-bold underline">
            log in
          </Link>{" "}
          before placing an order.
        </p>
      )}

      <form onSubmit={handlePlaceOrder} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* ---------------------- Left: forms ----------------------- */}
        <div className="space-y-8">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {/* Delivery details */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">Delivery Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ram Bahadur Shrestha"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Kathmandu"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Street address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Ward, street, landmark"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Order notes <span className="text-neutral-400">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any special instructions for delivery..."
                  value={form.notes}
                  onChange={handleChange}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">Payment Method</h2>

            <div className="mt-5 space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
                      form.paymentMethod === method.id
                        ? "border-neutral-950 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={handleChange}
                      className="h-4 w-4 accent-neutral-950"
                    />
                    <Icon className="h-5 w-5 text-neutral-600" />
                    <span>
                      <span className="block text-sm font-semibold text-neutral-900">
                        {method.label}
                      </span>
                      <span className="block text-xs text-neutral-500">{method.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------------------- Right: summary --------------------- */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-neutral-900">Your Order</h2>

          {/* Compact item list */}
          <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-neutral-900">{item.name}</p>
                  <p className="text-xs text-neutral-500">Qty: {item.qty}</p>
                </div>
                <p className="text-xs font-bold">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-neutral-100 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Delivery</dt>
              <dd className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </dd>
            </div>
            <hr className="border-neutral-100" />
            <div className="flex justify-between text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-semibold">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-neutral-900 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Place Order · {formatPrice(total)}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            By placing this order you agree to our terms.
          </p>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
