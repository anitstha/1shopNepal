function PagePlaceholder({ title, description, children }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6a1 1 0 00.9 1.4h11M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
        </div>
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wide bg-orange-100 text-orange-700 rounded-full">
          Coming Soon
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600">{description}</p>
        {children}
      </div>
    </div>
  )
}

export default PagePlaceholder
