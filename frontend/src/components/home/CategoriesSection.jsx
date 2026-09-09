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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Shop by Category"
        subtitle="Browse our most popular shopping categories"
        linkTo="/products"
      />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-4 rounded-2xl border border-gray-200"
            >
              <div className="w-full h-24 rounded-xl bg-gray-200 mb-3" />
              <div className="h-4 w-2/3 mx-auto rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center p-4 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center"
            >
              <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3 bg-orange-50 flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-200">
                  {cat.name.charAt(0)}
                </span>
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategoriesSection
