import { useState } from 'react'
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
  Check,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: 'Pay safely with cash on delivery, eSewa, Khalti or direct bank transfer. Your money and data are always protected.',
    points: ['Cash on delivery', 'eSewa & Khalti wallets', 'Visa, Mastercard & bank transfer'],
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick and reliable doorstep delivery across all of Nepal, with orders carefully packed and tracked every step of the way.',
    points: ['Delivery to all 64 districts', 'Order tracking on every purchase', 'Careful, protective packaging'],
  },
  {
    icon: BadgeCheck,
    title: 'Quality Products',
    desc: 'Every product is quality-checked before it ships so you always receive genuine items that match the description.',
    points: ['Quality checked before shipping', 'Only genuine, verified brands', '7-day easy return policy'],
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'A friendly support team is always around whenever you need help — before, during and after your purchase.',
    points: ['Call or email, anytime', 'WhatsApp chat support', 'Fast issue resolution'],
  },
]

function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState(0)
  const active = features[activeTab]

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 opacity-60 hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,rgba(163,163,170,0.15),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 border border-neutral-200 rounded-full bg-white/80">
          Why us
        </span>
        <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-neutral-950 tracking-tight leading-[1.08]">
          The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">
            1ShopNepal
          </span>{' '}
          difference
        </h2>
        <p className="mt-4 text-neutral-500 max-w-lg mx-auto leading-relaxed">
          Tap a feature to see why thousands of shoppers choose us.
        </p>

        {/* Tabs */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
          role="tablist"
          aria-label="Why choose us features"
        >
          {features.map((f, i) => (
            <button
              key={f.title}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === i
                  ? 'bg-neutral-950 text-white shadow-lg shadow-neutral-900/20'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.title}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          key={active.title}
          role="tabpanel"
          className="fade-slide-in mt-10 text-left rounded-[28px] bg-white/80 backdrop-blur border border-neutral-200 shadow-xl shadow-neutral-900/5 px-6 sm:px-10 py-10 grid md:grid-cols-2 gap-10 items-center"
        >
          <div>
            <span className="inline-flex w-16 h-16 rounded-3xl bg-neutral-950 text-white items-center justify-center">
              <active.icon className="w-8 h-8" />
            </span>
            <h3 className="mt-6 text-3xl font-bold text-neutral-950">{active.title}</h3>
            <p className="mt-3 text-neutral-500 leading-relaxed">{active.desc}</p>
            <Link
              to="/products"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-black"
            >
              Start shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ul className="space-y-3.5">
            {active.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-neutral-700 font-medium"
              >
                <span className="w-6 h-6 shrink-0 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs