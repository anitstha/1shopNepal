import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/common/ProductCard'
import Seo from '../components/common/Seo'
import { productApi, categoryApi } from '../services/api'

const SORTS = [
  { value: '', label: 'Sort by' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name: A to Z' },
]

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under Rs. 1,000', min: '', max: '1000' },
  { label: 'Rs. 1,000 - Rs. 5,000', min: '1000', max: '5000' },
  { label: 'Rs. 5,000 - Rs. 20,000', min: '5000', max: '20000' },
  { label: 'Rs. 20,000 - Rs. 50,000', min: '20000', max: '50000' },
  { label: 'Over Rs. 50,000', min: '50000', max: '' },
]

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const inStock = searchParams.get('inStock') || ''
  const page = Number(searchParams.get('page')) || 1
  const limit = 12

  const [categories, setCategories] = useState([])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(search)

  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let mounted = true
    const params = {
      page,
      limit,
      search,
      category,
      sort,
      inStock,
      minPrice,
      maxPrice,
    }
    productApi
      .getProducts(params)
      .then((res) => {
        if (mounted) setData(res)
      })
      .catch(() => {
        if (mounted) setData(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [page, search, category, sort, inStock, minPrice, maxPrice])

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value == null || value === 1) next.delete(key)
      else next.set(key, value)
    })
    if (!('page' in updates)) next.delete('page')
    setSearchParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateParams({ search: searchInput.trim() })
  }

  const clearFilters = () => setSearchParams({})

  const currentRange =
    PRICE_RANGES.find((r) => r.min === minPrice && r.max === maxPrice) ||
    PRICE_RANGES[0]

  const activeCategory = categories.find((c) => c.slug === category)
  const seoTitle = search
    ? `Search: ${search} | 1Shop Nepal`
    : activeCategory
      ? `${activeCategory.name} | 1Shop Nepal`
      : 'Shop All Products | 1Shop Nepal'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Seo
        title={seoTitle}
        description={
          search
            ? `Search results for "${search}" at 1Shop Nepal. Browse products across electronics, fashion, groceries, beauty and more.`
            : 'Browse the full 1Shop Nepal catalog. Shop electronics, fashion, groceries, beauty, home & living and accessories at affordable prices with nationwide delivery.'
        }
        canonical="/products"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-600 mt-2">
          Browse, search and filter the full 1ShopNepal catalog
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="flex items-center justify-between lg:hidden mb-3">
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParams({ category: '' })}
                  className={`block text-sm ${!category ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => updateParams({ category: c.slug })}
                    className={`block text-sm ${category === c.slug ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => updateParams({ minPrice: r.min, maxPrice: r.max })}
                    className={`block text-sm ${currentRange.label === r.label ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={inStock === 'true'}
                  onChange={(e) =>
                    updateParams({ inStock: e.target.checked ? 'true' : '' })
                  }
                  className="rounded border-gray-300"
                />
                In Stock only
              </label>
            </div>

            {(search || category || inStock || minPrice || maxPrice) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
              >
                <X className="w-4 h-4" /> Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          <form key={search} onSubmit={handleSearch} className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${data?.total || 0} products`}
            </p>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} disabled={!s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : data?.products?.length ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateParams({ page: page - 1 })}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40"
                  >
                    Prev
                  </button>
                  {Array.from({ length: data.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParams({ page: i + 1 })}
                      className={`w-10 h-10 text-sm font-medium rounded-lg ${
                        page === i + 1
                          ? 'bg-orange-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParams({ page: page + 1 })}
                    disabled={page >= data.pages}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products