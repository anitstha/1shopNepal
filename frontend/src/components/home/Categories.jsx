import { Link } from "react-router-dom";
import { categories } from "../../data/categories";

/**
 * "Shop by Category" grid shown on the home page.
 */
const Categories = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Categories</h2>
        <Link
          to="/products"
          className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          View all products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
            >
              <Icon className="h-5 w-5 shrink-0 text-neutral-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {category.name}
                </p>
                <p className="text-xs text-neutral-400">{category.items}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
