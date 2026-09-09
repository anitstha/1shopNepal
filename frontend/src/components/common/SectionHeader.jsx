import { Link } from 'react-router-dom'

function SectionHeader({ title, subtitle, linkTo, linkLabel = 'View all' }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          {linkLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default SectionHeader
