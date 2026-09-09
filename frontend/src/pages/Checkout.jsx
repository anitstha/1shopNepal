import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Loader2, Banknote, Lock, Wallet, ExternalLink } from 'lucide-react'
import Seo from '../components/common/Seo'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderApi, paymentApi } from '../services/api'

const SHIPPING_THRESHOLD = 10000
const SHIPPING_COST = 200

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    desc: 'Pay in cash when you receive your order',
    icon: Banknote,
  },
  {
    value: 'khalti',
    label: 'Khalti',
    desc: 'Pay securely online via Khalti wallet',
    icon: Wallet,
  },
]

function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, loading, clearCart } = useCart()
  const { user } = useAuth()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    district: '',
    zipCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')

  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping
  const placing = phase !== 'idle'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }
    if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine.trim() || !form.city.trim() || !form.district.trim()) {
      setError('Please fill in all required shipping details.')
      return
    }

    setError('')
    try {
      if (paymentMethod === 'cod') {
        setPhase('creating')
        const data = await orderApi.createOrder({
          shippingAddress: {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            addressLine: form.addressLine.trim(),
            city: form.city.trim(),
            district: form.district.trim(),
            zipCode: form.zipCode.trim(),
          },
          paymentMethod: 'cod',
        })
        await clearCart()
        navigate('/order-success', { state: { orderId: data.order._id, paymentMethod: 'cod' } })
        return
      }

      setPhase('creating')
      const data = await orderApi.createOrder({
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine: form.addressLine.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          zipCode: form.zipCode.trim(),
        },
        paymentMethod: 'khalti',
      })

      setPhase('initiating')
      const initiated = await paymentApi.initiateKhalti(data.order._id)

      setPhase('redirecting')
      window.location.assign(initiated.payment_url)
    } catch (err) {
      setError(err.message)
      setPhase('idle')
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Seo title="Checkout | 1Shop Nepal" description="Secure checkout at 1Shop Nepal." canonical="/checkout" noindex />
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Please Log In</h1>
        <p className="mt-2 text-gray-600">Log in to continue with checkout.</p>
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
        <Seo title="Checkout | 1Shop Nepal" description="Secure checkout at 1Shop Nepal." canonical="/checkout" noindex />
        <ShoppingCart className="w-12 h-12 mx-auto text-gray-300" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-600">Add some products before checking out.</p>
        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const inputClass =
    'w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo title="Checkout | 1Shop Nepal" description="Complete your order at 1Shop Nepal with Cash on Delivery or Khalti." canonical="/checkout" noindex />
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/cart" className="hover:text-orange-600">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX (10 digits)"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="addressLine">
                  Street Address *
                </label>
                <input
                  id="addressLine"
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  placeholder="House no, street, area"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="city">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="district">
                  District *
                </label>
                <input
                  id="district"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="zipCode">
                  ZIP / Postal Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon
                const active = paymentMethod === method.value
                return (
                  <label
                    key={method.value}
                    className={`flex items-center justify-between gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      active ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={active}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 accent-orange-600"
                      />
                      <Icon className={`w-6 h-6 ${active ? 'text-orange-600' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600">Available</span>
                  </label>
                )
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5" /> eSewa, bank transfer coming soon. Khalti payments are
              verified securely on our server.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rs. {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Add Rs. {(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-900 font-bold text-base">
                <span>Grand Total</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={placing}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {phase === 'initiating'
                    ? 'Initiating Khalti payment...'
                    : phase === 'redirecting'
                      ? 'Redirecting to Khalti...'
                      : 'Placing Order...'}
                </>
              ) : (
                'Place Order'
              )}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">
              {paymentMethod === 'cod' ? (
                'By placing your order you agree to pay the total amount at delivery.'
              ) : (
                <>
                  You will be redirected to Khalti to complete payment of{' '}
                  <span className="font-medium text-gray-500">Rs. {grandTotal.toLocaleString()}</span>
                  <ExternalLink className="inline w-3 h-3 ml-0.5" />
                </>
              )}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout