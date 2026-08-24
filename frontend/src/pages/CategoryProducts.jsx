import { Link, useParams } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getCategoryBySlug, categories } from "../data/categories";
import { useCatalog } from "../context/CatalogContext";

/**
 * Product list filtered by the category in the URL.
 * Route: /category/:slug
 */
const CategoryProducts = () => {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const { products } = useCatalog();

  // Title reflects the selected category (or falls back gracefully)
  useDocumentTitle(category ? category.name : "Category");

  const categoryProducts = products.filter((p) => p.category === slug);

  if (!category) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title="Category not found"
          description="The category you are looking for doesn't exist."
        >
          <Link
            to="/category"
            className="inline-block rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white"
          >
            View all categories
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-neutral-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-neutral-900">Home</Link>
        <span>/</span>
        <Link to="/category" className="hover:text-neutral-900">Categories</Link>
        <span>/</span>
        <span className="font-semibold text-neutral-900">{category.name}</span>
      </nav>

      {/* Category heading */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          {category.name}
        </h1>
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          {category.tagline} — browse our full range of {category.name.toLowerCase()}.
        </p>
      </div>

      {/* Products */}
      {categoryProducts.length > 0 ? (
        <>
          {/* Quick links to sibling categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  c.slug === slug
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <ProductGrid products={categoryProducts} />
        </>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title={`No products in ${category.name} yet`}
          description="Check back soon — we restock regularly."
        >
          <Link
            to="/products"
            className="inline-block rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white"
          >
            Browse all products
          </Link>
        </EmptyState>
      )}
    </section>
  );
};

export default CategoryProducts;
