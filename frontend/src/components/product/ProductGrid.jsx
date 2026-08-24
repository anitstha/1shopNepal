import ProductCard from "./ProductCard";

/**
 * Responsive grid of ProductCards.
 * Pass `products` (array) — empty grids render nothing,
 * the parent page decides what empty state to show.
 */
const ProductGrid = ({ products = [] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
