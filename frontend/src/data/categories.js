import { Smartphone, Shirt, Sofa, Watch } from "lucide-react";

/**
 * Product categories used across the storefront.
 * `slug` is used in category URLs (e.g. /category/electronics).
 */
export const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    tagline: "Smart tech & gadgets",
    items: "120+ products",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fashion",
    slug: "fashion",
    tagline: "Trendy styles for all",
    items: "250+ products",
    icon: Shirt,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    tagline: "Cozy essentials",
    items: "90+ products",
    icon: Sofa,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    tagline: "Watches, bags & more",
    items: "150+ products",
    icon: Watch,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  },
];

/** Finds a category by its slug. Returns undefined when not found. */
export const getCategoryBySlug = (slug) =>
  categories.find((category) => category.slug === slug);
