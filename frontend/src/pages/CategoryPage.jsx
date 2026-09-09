import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import Seo from '../components/common/Seo'
import { categoryApi, productApi } from '../services/api'
import { siteUrl } from '../utils/seo'

function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let mounted = true
    categoryApi
      .getCategories()
      .then((data) => {
        const match = data.categories.find((c) => c.slug === slug)
        if (!mounted) return
        if (match) setCategory(match)
        else setNotFound(true)
      })
      .catch(() => {
        if (mounted) setNotFound(true)
      })

    productApi
      .getProducts({ category: slug, limit: 100 })
      .then((res) => {
        if (mounted) setProducts(res.products)
      })
      .catch(() => {
        if (mounted) setProducts([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [slug])

  if (notFound) {
    return (
      <>
        <Seo title="Category Not Found | 1Shop Nepal" noindex />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Category Not Found</h1>
          <Link
            to="/products"
            className="inline-block mt-6 px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      </>
    )
  }

  const origin = siteUrl()
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${origin}/categories`,
      },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category.name }]
        : []),
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo
        title={category ? `${category.name} | 1Shop Nepal` : 'Categories | 1Shop Nepal'}
        description={
          category?.description ||
          `Browse products in the ${category?.name || ''} category at 1Shop Nepal.`
        }
        canonical={`/categories/${slug}`}
        image={category?.image}
        jsonLd={breadcrumbJsonLd}
      />
      {category ? (
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {category.description || 'Browse products in this category.'}{' '}
              <span className="text-gray-400">({products.length} items)</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-pulse my-6">
          <div className="h-8 w-56 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-80 bg-gray-200 rounded" />
        </div>
      )}

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
      ) : products.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No products in this category yet</p>
          <Link
            to="/products"
            className="inline-block mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Browse all products
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
