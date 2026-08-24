import SectionHeader from "../ui/SectionHeader";
import ProductGrid from "../product/ProductGrid";
import { useCatalog } from "../../context/CatalogContext";

/**
 * Top-rated products pulled straight from the catalog context.
 */
const FeaturedProducts = () => {
  const { products } = useCatalog();
  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <SectionHeader
        title="Popular right now"
        actionTo="/products"
        actionLabel="View all"
      />
      <ProductGrid products={featured} />
    </section>
  );
};

export default FeaturedProducts;
