import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, ArrowRight, Star, Zap } from 'lucide-react'
import { productApi, categoryApi } from '../../services/api'
import { products as mockProducts, categories as mockCategories } from '../../data/homeData'

const productImage = (p) => p.images?.[0] || p.image
const productId = (p) => p._id || p.id
const productSlug = (p) => p.slug || productId(p)

const priceOf = (p) => {
  const regular = Number(p.price || 0)
  const sale = p.discountPrice ? Number(p.discountPrice) : regular
  return { regular, sale }
}

const discountOf = (p) => {
  const { regular, sale } = priceOf(p)
  return regular > 0 && sale > 0 && sale < regular
    ? Math.round(((regular - sale) / regular) * 100)
    : 0
}

const categoryName = (p) => p.category?.name || p.categoryName || 'Products'

function Hero() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    Promise.all([
      productApi
        .getProducts({ sort: 'rating', limit: 4 })
        .then((d) => d.products)
        .catch(() => mockProducts),
      categoryApi
        .getCategories()
        .then((d) => d.categories)
        .catch(() => mockCategories),
    ]).then(([prods, cats]) => {
      if (!mounted) return
      setProducts(prods && prods.length ? prods : mockProducts)
      setCategories(cats && cats.length ? cats : mockCategories)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
  }

  const featured = products.slice(0, 4)
  const count = featured.length
  const current = featured[active]
  const idx2 = (active + 1) % count
  const idx3 = (active + 2) % count
  const small1 = featured[idx2]
  const small2 = featured[idx3]

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_0%,rgba(251,191,36,0.14),transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left column — copy, search, CTA, categories */}
          <div className="lg:col-span-7">
            <h1
              className="hero-rise text-5xl sm:text-6xl xl:text-[4rem] font-bold text-neutral-950 leading-[1.06] tracking-tight"
              style={{ animationDelay: '0.05s' }}
            >
              Everything you need,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">
                delivered across Nepal.
              </span>
            </h1>

            <p
              className="hero-rise mt-5 text-lg text-neutral-500 max-w-lg leading-relaxed"
              style={{ animationDelay: '0.25s' }}
            >
              Electronics, fashion, groceries and more — at prices you&apos;ll
              love, delivered to all 64 districts.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hero-rise mt-9 relative max-w-xl"
              style={{ animationDelay: '0.35s' }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-13 pr-28 py-4 rounded-full border border-neutral-200 bg-white shadow-lg shadow-neutral-900/5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-neutral-900 rounded-full hover:bg-black transition-colors"
              >
                Search
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Primary CTA */}
            <div
              className="hero-rise mt-7 flex items-center gap-6"
              style={{ animationDelay: '0.45s' }}
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-black rounded-full transition-colors shadow-lg shadow-neutral-900/15"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="hidden sm:block text-sm text-neutral-400 font-medium">
                Free delivery over Rs. 2,000
              </p>
            </div>

            {/* Category quick access */}
            <div
              className="hero-rise mt-8 flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible"
              style={{ animationDelay: '0.55s' }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.id}
                  to={`/categories/${cat.slug || cat.id}`}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right column — interactive product showcase */}
          <div className="lg:col-span-5">
            {loading ? (
              <>
                <div className="hidden lg:grid grid-cols-5 grid-rows-3 gap-4 h-[440px]" aria-hidden="true">
                  <div className="col-span-3 row-span-3 rounded-[28px] bg-neutral-200 animate-pulse" />
                  {[0, 1].map((i) => (
                    <div key={i} className="col-span-2 row-span-1 rounded-2xl bg-neutral-200 animate-pulse" />
                  ))}
                  <div className="col-span-2 row-span-1 rounded-2xl bg-neutral-100 animate-pulse" />
                </div>
                <div className="lg:hidden flex gap-3 overflow-hidden" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-40 shrink-0 rounded-2xl bg-neutral-200 animate-pulse p-3">
                      <div className="aspect-square rounded-xl bg-neutral-300" />
                      <div className="mt-3 h-3 w-3/4 rounded bg-neutral-300" />
                    </div>
                  ))}
                </div>
              </>
            ) : count > 0 && current && small1 && small2 ? (
              <>
                {/* Desktop bento showcase */}
                <div className="hidden lg:grid grid-cols-5 grid-rows-3 gap-4 h-[440px]">
                  {(() => {
                    const { regular, sale } = priceOf(current)
                    const discount = discountOf(current)
                    const img = productImage(current)
                    const rating = Number(current.rating || 0)
                    const reviews = current.reviewCount ?? current.reviews ?? 0
                    return (
                      <Link
                        to={`/products/${productSlug(current)}`}
                        className="relative col-span-3 row-span-3 rounded-[28px] overflow-hidden bg-neutral-950 group"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={current.name}
                            className="absolute inset-0 w-full h-full object-cover hero-slow-zoom opacity-90"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/10" />

                        <span className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-neutral-900 text-xs font-bold shadow-lg">
                          View product
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>

                        <div className="absolute inset-x-0 bottom-0 p-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-bold uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5" />
                            {discount > 0 ? `${discount}% off` : 'Hot pick'}
                          </span>
                          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-amber-300/90 font-semibold">
                            {categoryName(current)}
                          </p>
                          <h3 className="mt-1 text-xl font-semibold text-white leading-snug line-clamp-1">
                            {current.name}
                          </h3>
                          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="inline-flex items-center gap-1 text-xs text-white/80">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {rating ? rating.toFixed(1) : 'New'}
                              {reviews > 0 && <span className="text-white/50">({reviews})</span>}
                            </span>
                            <span className="text-lg font-bold text-white">
                              Rs. {sale.toLocaleString()}
                            </span>
                            {discount > 0 && (
                              <span className="text-xs text-amber-300/80 line-through">
                                Rs. {regular.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })()}

                  {[
                    { p: small1, idx: idx2 },
                    { p: small2, idx: idx3 },
                  ].map(({ p, idx }) => {
                    const { sale } = priceOf(p)
                    return (
                      <button
                        key={productId(p)}
                        onClick={() => setActive(idx)}
                        className={`relative col-span-2 row-span-1 flex items-center gap-2.5 rounded-2xl bg-white border p-2.5 text-left transition-all ${
                          active === idx
                            ? 'border-neutral-900 shadow-lg shadow-neutral-900/10'
                            : 'border-neutral-200 hover:border-neutral-900 hover:shadow-md'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                          {productImage(p) ? (
                            <img
                              src={productImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
                            {categoryName(p)}
                          </p>
                          <p className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                            {p.name}
                          </p>
                          <p className="text-sm font-bold text-neutral-900 mt-0.5">
                            Rs. {sale.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    )
                  })}

                  <Link
                    to="/products"
                    className="col-span-2 row-span-1 flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-white text-sm font-semibold hover:bg-black transition-colors"
                  >
                    View all products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Mobile product strip */}
                <div className="lg:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                  {featured.map((p) => {
                    const { sale } = priceOf(p)
                    const discount = discountOf(p)
                    return (
                      <Link
                        key={productId(p)}
                        to={`/products/${productSlug(p)}`}
                        className="w-40 shrink-0 rounded-2xl bg-white border border-neutral-200 p-3 hover:border-neutral-900 transition-colors"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100">
                          {productImage(p) ? (
                            <img
                              src={productImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200" />
                          )}
                          {discount > 0 && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-neutral-950 text-white text-[10px] font-bold">
                              -{discount}%
                            </span>
                          )}
                        </div>
                        <p className="mt-2.5 text-xs font-semibold text-neutral-900 line-clamp-1">
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm font-bold text-neutral-900">
                          Rs. {sale.toLocaleString()}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero