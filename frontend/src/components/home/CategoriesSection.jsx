import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../common/SectionHeader'
import { categories as mockCategories } from '../../data/homeData'
import { categoryApi } from '../../services/api'

function CategoriesSection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    categoryApi
      .getCategories()
      .then((data) => {
        if (mounted) setCategories(data.categories)
      })
      .catch(() => {
        if (mounted) setCategories(mockCategories)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        eyebrow="Departments"
        title="Shop by Category"
        subtitle="Browse our curated collection across every department"
        linkTo="/products"
      />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 overflow-hidden">
              <div className="aspect-[4/5] bg-neutral-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 mx-auto rounded bg-neutral-200" />
                <div className="h-2.5 w-1/2 mx-auto rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100"
            >
              <div className="aspect-[4/5]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/10 to-transparent group-hover:from-neutral-900/90 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                  <p className="font-semibold text-white text-sm">{cat.name}</p>
                  <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoriesSection