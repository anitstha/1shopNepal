import { Link } from 'react-router-dom'
import { Tag, ArrowRight, Clock3, Zap } from 'lucide-react'

const countdown = [
  { value: '03', unit: 'Days' },
  { value: '12', unit: 'Hrs' },
  { value: '45', unit: 'Min' },
  { value: '20', unit: 'Sec' },
]

function DealSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-[28px] bg-neutral-950 text-white shadow-2xl shadow-neutral-900/20">
        <img
          src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />

        <div className="absolute -top-20 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative px-6 py-12 sm:px-12 sm:py-16 grid lg:grid-cols-[1.4fr_1fr] items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white border border-white/25 rounded-full bg-white/10">
              <Zap className="w-3.5 h-3.5" />
              Limited time offer
            </div>

            <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Up to 40% off
              <br />
              <span className="text-white/60">this week only</span>
            </h2>
            <p className="mt-3 text-white/80 max-w-md">
              Limited-time deals across electronics, fashion, home essentials
              and more. Grab them before they&apos;re gone.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Clock3 className="w-5 h-5 text-white/60" />
              {countdown.map((t, i) => (
                <div key={t.unit} className="flex items-center gap-3">
                  <div className="text-center w-14 py-2.5 rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
                    <div className="text-xl font-bold leading-none">{t.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
                      {t.unit}
                    </div>
                  </div>
                  {i < countdown.length - 1 && (
                    <span className="text-white/40 font-bold">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex lg:justify-end">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-neutral-900 bg-white hover:bg-amber-300 rounded-full transition-colors shadow-xl shadow-black/30"
            >
              <Tag className="w-5 h-5" />
              Grab the Deals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DealSection