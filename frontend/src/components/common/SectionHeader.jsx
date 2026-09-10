import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function SectionHeader({ title, subtitle, linkTo, linkLabel = 'View all', eyebrow }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-10">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-neutral-500 text-base">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 border-b border-neutral-300 pb-0.5 hover:border-neutral-900 transition-colors shrink-0"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeader