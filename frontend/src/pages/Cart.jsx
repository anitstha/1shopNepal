import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Seo from '../components/common/Seo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const SHIPPING_THRESHOLD = 10000
const SHIPPING_COST = 200

function Cart() {
  const { items, subtotal, itemCount, loading, updateItem, removeItem, clearCart } =
    useCart()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Seo title="Shopping Cart | 1Shop Nepal" description="Your 1Shop Nepal shopping cart." canonical="/cart" noindex />
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your Cart is Waiting</h1>
        <p className="mt-2 text-gray-600">
          Please log in to view and manage your shopping cart.
        </p>
        <Link
          to="/login"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          Log In
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Seo title="Shopping Cart | 1Shop Nepal" description="Your 1Shop Nepal shopping cart." canonical="/cart" noindex />
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo title="Shopping Cart | 1Shop Nepal" description="Review the items in your 1Shop Nepal shopping cart and proceed to checkout." canonical="/cart" noindex />
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-gray-600">{itemCount} item(s) in your cart</p>

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white rounded-2xl border border-gray-200 p-4"
            >
              <Link to={`/products/${item.product.slug || item.product._id}`} className="shrink-0">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-200" />
                )}
              </Link>

              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="font-semibold text-gray-900 hover:text-orange-600 line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-0.5">
                  Rs. {item.price.toLocaleString()} each
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        updateItem(item.product._id, Math.max(1, item.quantity - 1))
                      }
                      className="p-2 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItem(item.product._id, item.quantity + 1)
                      }
                      disabled={
                        item.quantity >= item.product.stock
                      }
                      className="p-2 hover:bg-gray-50 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add Rs. {(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold">
                <span>Total</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
