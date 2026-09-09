import { useEffect, useState } from 'react'
import SectionHeader from '../common/SectionHeader'
import ProductCard from '../common/ProductCard'
import { productApi } from '../../services/api'

function PopularProducts() {
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    productApi
      .getProducts({ limit: 8 })
      .then((res) => {
        if (mounted) setPopular(res.products)
      })
      .catch(() => {
        if (mounted) setPopular([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="Popular Products"
          subtitle="Trending items our customers love"
          linkTo="/products"
        />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : popular.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popular.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PopularProducts
