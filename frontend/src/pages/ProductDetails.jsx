import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Minus,
  PackageSearch,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import RatingStars from "../components/ui/RatingStars";
import SectionHeader from "../components/ui/SectionHeader";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useCatalog } from "../context/CatalogContext";
import { useCart } from "../context/CartContext";
import { formatPrice, discountPercent } from "../utils/format";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useCatalog();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === Number(id));
  useDocumentTitle(product?.name ?? "Product");

  // Product may not exist (bad URL or deleted by admin)
  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          description="It may have been removed or the link is incorrect."
        >
          <Link
            to="/products"
            className="inline-block rounded-lg bg-neutral-950 px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to products
          </Link>
        </EmptyState>
      </section>
    );
  }

  const discount = discountPercent(product.price, product.oldPrice);

  /** Adds to cart and shows a short confirmation on the button. */
  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  /** Adds to cart and jumps straight to checkout. */
  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  // Related products from the same category
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-neutral-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-neutral-900">Products</Link>
        <span>/</span>
        <span className="font-semibold text-neutral-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* ------------------------- Gallery ------------------------- */}
        <div>
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-[420px] w-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`overflow-hidden rounded-md border transition-colors ${
                    activeImage === index ? "border-neutral-900" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={image} alt="" className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* -------------------------- Info -------------------------- */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">{product.brand}</span>
            {discount > 0 && (
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-medium text-white">
                Save {discount}%
              </span>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-neutral-500">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <p className="text-2xl font-semibold text-neutral-900">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="pb-1 text-lg text-neutral-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>

          {/* Stock status */}
          <p className="mt-3 text-sm">
            {product.stock > 0 ? (
              <span className="font-semibold text-emerald-600">
                In stock{product.stock <= 5 && ` — only ${product.stock} left!`}
              </span>
            ) : (
              <span className="font-semibold text-red-600">Out of stock</span>
            )}
          </p>

          <p className="mt-5 leading-relaxed text-neutral-600">{product.description}</p>

          {/* Feature list */}
          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-neutral-700">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" /> {feature}
              </li>
            ))}
          </ul>

          {/* Quantity + Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center rounded-xl border border-neutral-200 bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="p-3 text-neutral-600 transition-colors hover:text-neutral-950 disabled:opacity-30"
                disabled={qty <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                className="p-3 text-neutral-600 transition-colors hover:text-neutral-950 disabled:opacity-30"
                disabled={qty >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-10"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-10"
            >
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-xs text-neutral-500">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-neutral-400" />
              Free delivery over Rs. 5,000
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-400" />
              Genuine product warranty
            </p>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <SectionHeader
            title="Related Products"
            actionTo={`/category/${product.category}`}
            actionLabel="View category"
          />
          <ProductGrid products={related} />
        </div>
      )}

      {/* Back link */}
      <div className="mt-14">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </div>
    </section>
  );
};

export default ProductDetails;
