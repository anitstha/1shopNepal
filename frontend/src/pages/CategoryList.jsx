import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { categories } from "../data/categories";

/**
 * Overview page listing every product category.
 * Route: /category
 */
const CategoryList = () => {
  useDocumentTitle("Categories");

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Categories</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Pick a category to browse its products.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="flex items-center gap-4 rounded-lg border border-neutral-200 p-5 transition-colors hover:border-neutral-400"
            >
              <Icon className="h-5 w-5 shrink-0 text-neutral-500" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-medium text-neutral-900">
                  {category.name}
                </h2>
                <p className="text-xs text-neutral-400">
                  {category.tagline} · {category.items}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-neutral-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryList;
