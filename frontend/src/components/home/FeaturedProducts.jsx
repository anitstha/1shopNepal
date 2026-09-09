import { useEffect, useState } from 'react'
import SectionHeader from '../common/SectionHeader'
import ProductCard from '../common/ProductCard'
import { productApi } from '../../services/api'

function FeaturedProducts() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    productApi
      .getProducts({ sort: 'rating', limit: 4 })
      .then((res) => {
        if (mounted) setFeatured(res.products)
      })
      .catch(() => {
        if (mounted) setFeatured([])
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
      <SectionHeader title="Featured Products" subtitle="Hand-picked deals just for you" linkTo="/products" />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-200 h-48" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-5 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : featured.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default FeaturedProducts
