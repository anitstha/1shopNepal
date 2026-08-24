import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import RatingStars from "../ui/RatingStars";
import { useCart } from "../../context/CartContext";
import { formatPrice, discountPercent } from "../../utils/format";

/**
 * Product tile used in every product grid across the storefront.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  /** Adds to cart and briefly flips the button to a "Added" state. */
  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col rounded-lg border border-neutral-200 bg-white">
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden rounded-t-lg bg-neutral-50">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-56 w-full object-cover"
        />

        {(product.badge === "sale" || discount > 0) && (
          <span className="absolute top-2 left-2 rounded bg-neutral-900 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {discount > 0 ? `-${discount}%` : "Sale"}
          </span>
        )}
        {product.badge === "new" && (
          <span className="absolute top-2 left-2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[11px] text-neutral-700">
            New
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-neutral-400">{product.brand}</p>

        <Link
          to={`/products/${product.id}`}
          className="mt-1 line-clamp-2 text-sm text-neutral-800 hover:underline"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <RatingStars rating={product.rating} size="h-3 w-3" />
          <span className="text-xs text-neutral-400">({product.reviews})</span>
        </div>

        {/* Price + Add button */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-xs text-neutral-400 line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
              added
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
