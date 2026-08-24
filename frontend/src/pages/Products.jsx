import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchX, X } from "lucide-react";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useCatalog } from "../context/CatalogContext";
import { categories } from "../data/categories";
import { formatPrice } from "../utils/format";

/** Sort options for the dropdown. */
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
];

/** Preset price ranges (in NPR) shown as filter chips. */
const PRICE_RANGES = [
  { label: "Under Rs. 2,000", min: 0, max: 2000 },
  { label: "Rs. 2,000 – 10,000", min: 2000, max: 10000 },
  { label: "Rs. 10,000 – 50,000", min: 10000, max: 50000 },
  { label: "Above Rs. 50,000", min: 50000, max: Infinity },
];

const Products = () => {
  useDocumentTitle("All Products");
  const { products } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state — category, search query & badge come from the URL
  const activeCategory = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const activeBadge = searchParams.get("badge");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState(null);

  /** Updates one URL param while clearing the rest of the filters. */
  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  /** Applies category, search and price filters + sorting. */
  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (activeBadge) {
      list = list.filter((p) => p.badge === activeBadge);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (priceRange) {
      list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break; // "featured" keeps the original order
    }

    return list;
  }, [products, activeCategory, query, activeBadge, priceRange, sort]);

  const hasActiveFilters =
    activeCategory !== "all" || Boolean(query) || Boolean(activeBadge) || Boolean(priceRange);

  /** Clears every filter back to defaults. */
  const clearFilters = () => {
    setSearchParams({});
    setPriceRange(null);
    setSort("featured");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          All Products
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Showing {visibleProducts.length} of {products.length} products
          {query && (
            <>
              {" "}
              for <span className="font-semibold text-neutral-900">“{query}”</span>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* ------------------------- Sidebar ------------------------- */}
        <aside className="space-y-8">
          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-900">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setParam("category", null)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === "all"
                      ? "bg-neutral-950 font-semibold text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <button
                    type="button"
                    onClick={() => setParam("category", category.slug)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeCategory === category.slug
                        ? "bg-neutral-950 font-semibold text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price ranges */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-neutral-900">
              Price
            </h3>
            <ul className="space-y-1">
              {PRICE_RANGES.map((range) => (
                <li key={range.label}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
                    <input
                      type="radio"
                      name="price-range"
                      checked={priceRange?.label === range.label}
                      onChange={() => setPriceRange(range)}
                      className="h-4 w-4 accent-neutral-950"
                    />
                    {range.label}
                  </label>
                </li>
              ))}
              {priceRange && (
                <li>
                  <button
                    type="button"
                    onClick={() => setPriceRange(null)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" /> Clear price filter
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Free delivery note */}
          <div className="rounded-lg border border-neutral-200 p-4 text-xs leading-relaxed text-neutral-500">
            Free delivery on all orders above{" "}
            {formatPrice(5000)}.
          </div>
        </aside>

        {/* ------------------------- Content ------------------------- */}
        <div>
          {/* Toolbar: sort + clear */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {visibleProducts.length} result{visibleProducts.length !== 1 && "s"}
            </p>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-red-300 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" /> Clear filters
                </button>
              )}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid or empty state */}
          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No products found"
              description="Try adjusting your search or removing some filters."
            >
              <Link
                to="/products"
                onClick={clearFilters}
                className="inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Browse everything
              </Link>
            </EmptyState>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
