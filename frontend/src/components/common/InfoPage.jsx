import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Seo from './Seo'

export function InfoPage({
  title,
  subtitle,
  icon: Icon,
  meta,
  wide = false,
  children,
}) {
  return (
    <>
      <Seo title={`${title} | 1Shop Nepal`} description={subtitle} />
      <div className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 hero-grid opacity-30" aria-hidden="true" />
        <div
          className="absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-neutral-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-neutral-700/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pb-16">
          <nav className="flex items-center gap-1.5 text-xs text-neutral-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-300">{title}</span>
          </nav>

          <div className="mt-10 max-w-2xl">
            {Icon && (
              <span className="inline-flex w-14 h-14 rounded-2xl bg-white text-neutral-950 items-center justify-center shadow-xl shadow-black/20">
                <Icon className="w-7 h-7" />
              </span>
            )}
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-white">
              {title}
            </h1>
            <span className="mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-white to-neutral-500" />
            <p className="mt-5 text-neutral-400 leading-relaxed">{subtitle}</p>
            {meta && (
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-neutral-500">{meta}</p>
            )}
          </div>
        </div>
      </div>
      <div className={wide ? 'max-w-5xl' : 'max-w-3xl'}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">{children}</div>
      </div>
    </>
  )
}

export function InfoSection({ index, title, intro, children }) {
  return (
    <section className="border-t border-neutral-200 py-8 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex items-baseline gap-4">
        {index != null && (
          <span className="font-display text-sm font-bold text-neutral-400">
            {String(index).padStart(2, '0')}
          </span>
        )}
        <h2 className="text-xl font-bold text-neutral-950">{title}</h2>
      </div>
      {intro && <p className="mt-3 text-neutral-600 leading-relaxed">{intro}</p>}
      <div className="mt-3 space-y-3 text-neutral-600 leading-relaxed">{children}</div>
    </section>
  )
}

export function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="group rounded-3xl bg-white border border-neutral-200 p-6 shadow-sm hover:border-neutral-400 hover:shadow-xl hover:shadow-neutral-900/5 transition-all duration-300">
      {Icon && (
        <span className="inline-flex w-12 h-12 rounded-2xl bg-neutral-950 text-white items-center justify-center group-hover:scale-105 group-hover:bg-black transition-all duration-300">
          <Icon className="w-6 h-6" />
        </span>
      )}
      {title && <h3 className="mt-4 font-bold text-neutral-950">{title}</h3>}
      {children && (
        <div className="mt-2 text-sm text-neutral-500 leading-relaxed">{children}</div>
      )}
    </div>
  )
}