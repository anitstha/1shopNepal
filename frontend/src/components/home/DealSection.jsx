import { Link } from 'react-router-dom'
import { Tag, ArrowRight } from 'lucide-react'

function DealSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 20%, white 1.5px, transparent 1.5px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative px-6 py-12 sm:px-12 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-semibold mb-4">
              <Tag className="w-4 h-4" />
              Mega Discount Sale
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Up to 40% Off</h2>
            <p className="mt-2 text-white/90">
              Limited-time deals on electronics, fashion &amp; more
            </p>
            <div className="mt-4 flex items-center gap-3 justify-center sm:justify-start">
              <div className="bg-white text-orange-600 rounded-xl px-3 py-2 font-bold text-center min-w-[60px]">
                <div className="text-xl">03</div>
                <div className="text-[10px] uppercase">Days</div>
              </div>
              <div className="bg-white text-orange-600 rounded-xl px-3 py-2 font-bold text-center min-w-[60px]">
                <div className="text-xl">12</div>
                <div className="text-[10px] uppercase">Hrs</div>
              </div>
              <div className="bg-white text-orange-600 rounded-xl px-3 py-2 font-bold text-center min-w-[60px]">
                <div className="text-xl">45</div>
                <div className="text-[10px] uppercase">Min</div>
              </div>
              <div className="bg-white text-orange-600 rounded-xl px-3 py-2 font-bold text-center min-w-[60px]">
                <div className="text-xl">20</div>
                <div className="text-[10px] uppercase">Sec</div>
              </div>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-full shadow-lg transition-colors shrink-0"
          >
            Grab the Deals
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DealSection
