import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Truck,
  BadgeCheck,
  RotateCcw,
} from 'lucide-react'

const heroStats = [
  { value: '10K+', label: 'Products' },
  { value: '77', label: 'Districts' },
  { value: '50K+', label: 'Happy Customers' },
]

const perks = [
  { icon: ShoppingBag, title: 'Genuine Products', desc: 'Authentic items guaranteed' },
  { icon: Truck, title: 'Fast Delivery', desc: 'All over Nepal' },
  { icon: BadgeCheck, title: 'Secure Payment', desc: 'COD, eSewa & Khalti' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold uppercase tracking-wide bg-orange-100 text-orange-700 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
              Nepal&apos;s Trusted Online Store
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Shop Everything,
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Delivered in Nepal.
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-lg">
              From electronics to daily groceries, discover thousands of quality
              products at unbeatable prices — all in one place, right to your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-lg shadow-orange-200 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-7 py-3.5 text-base font-semibold text-gray-700 border border-gray-300 hover:border-orange-300 hover:text-orange-600 rounded-full transition-colors"
              >
                Explore Deals
              </Link>
            </div>

            <div className="mt-10 flex gap-10">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                  alt="Shopping experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-2 bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
                <div className="text-2xl font-extrabold text-orange-600">Rs. 850</div>
                <div className="text-xs text-gray-500">Himalayan Honey</div>
              </div>
              <div className="absolute -bottom-4 -left-2 bg-white rounded-2xl shadow-lg px-4 py-3 text-center">
                <div className="text-2xl font-extrabold text-green-600">-30%</div>
                <div className="text-xs text-gray-500">Today Only</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                <perk.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{perk.title}</div>
                <div className="text-xs text-gray-500">{perk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
