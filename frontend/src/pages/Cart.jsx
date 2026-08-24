import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../data/products";

const Cart = () => {
  useDocumentTitle("Shopping Cart");
  const navigate = useNavigate();
  const { items, updateQty, removeFromCart, subtotal } = useCart();

  const deliveryFee =
    items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  // Empty cart state
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore the store to find something you love."
        >
          <Link
            to="/products"
            className="inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Start Shopping
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Shopping Cart
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {items.length} item{items.length !== 1 && "s"} in your cart
      </p>

      {/* Free delivery progress hint */}
      {amountToFreeDelivery > 0 && (
        <p className="mt-4 rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-600">
          Add {formatPrice(amountToFreeDelivery)} more to get free delivery.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* ------------------------- Cart items ------------------------- */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  {/* Quantity stepper */}
                  <div className="flex items-center rounded-lg border border-neutral-200">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                      className="p-2 text-neutral-600 transition-colors hover:text-neutral-950 disabled:opacity-30"
                      disabled={item.qty <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                      className="p-2 text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-base font-bold text-neutral-950">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        </div>

        {/* -------------------------- Summary --------------------------- */}
        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-neutral-900">Order Summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
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
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full rounded-md bg-neutral-900 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Proceed to Checkout
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            Cash on Delivery available across Nepal
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
