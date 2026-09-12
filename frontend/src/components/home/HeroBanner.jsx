import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BANNERS = [
  { src: '/banner1.png' },
  { src: '/banner2.png' },
  { src: '/banner3.png' },
  { src: '/banner4.png' },
  { src: '/banner5.png' },
  { src: '/banner6.png' },
]

const AUTOPLAY_MS = 4500

/**
 * Hero — full-width, auto-playing banner slider (Daraz-style).
 */
function HeroBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % BANNERS.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused])

  const goTo = (i) => setIndex((i + BANNERS.length) % BANNERS.length)

  return (
    <section
      className="relative w-full bg-neutral-100"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[2.87/1] w-full overflow-hidden">
        {BANNERS.map((banner, i) => (
          <Link
            key={banner.src}
            to="/products"
            tabIndex={i === index ? 0 : -1}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <img
              src={banner.src}
              alt={`Banner ${i + 1}`}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
              loading={i === 0 ? undefined : 'lazy'}
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous banner"
        className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 sm:flex"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next banner"
        className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105 sm:flex"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
        {BANNERS.map((banner, i) => (
          <button
            key={banner.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to banner ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-orange-600' : 'w-2 bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;