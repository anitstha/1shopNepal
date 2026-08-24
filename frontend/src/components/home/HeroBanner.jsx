import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { formatPrice } from "../../utils/format";

/**
 * Home hero — big typographic intro above two endless
 * product marquees scrolling in opposite directions.
 */
const HeroBanner = () => {
  const { products } = useCatalog();
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  const rowA = sorted.slice(0, Math.ceil(sorted.length / 2));
  const rowB = sorted.slice(Math.ceil(sorted.length / 2));

  return (
    <section className="overflow-hidden border-b border-neutral-200 bg-neutral-50">
      {/* Copy */}
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-6xl">
          Everything you need,{" "}
          <em className="font-serif font-medium italic">delivered anywhere</em>{" "}
          in Nepal.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">
          Electronics, clothing, home goods and accessories from trusted
          sellers. Order online, pay on delivery.
        </p>
        <div className="mt-8 flex items-center gap-5">
          <Link
            to="/products"
            className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Shop now
          </Link>
          <Link
            to="/category"
            className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            Browse categories
          </Link>
        </div>
      </div>

      {/* Marquees */}
      {sorted.length > 0 && (
        <div
          className="marquee space-y-3 pb-14 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          aria-hidden="true"
        >
          {[rowA, rowB].map((row, rowIndex) => {
            if (row.length === 0) return null;
            const items = [...row, ...row]; // duplicated for a seamless loop
            return (
              <div key={rowIndex} className="overflow-hidden">
                <div
                  className={`marquee-track flex w-max ${
                    rowIndex === 1 ? "marquee-track--reverse" : ""
                  }`}
                >
                  {items.map((product, index) => (
                    <Link
                      key={`${product.id}-${index}`}
                      to={`/products/${product.id}`}
                      tabIndex={-1}
                      className="mr-3 w-40 shrink-0 rounded-lg border border-neutral-200 bg-white transition-colors hover:border-neutral-400"
                    >
                      <img
                        src={product.images[0]}
                        alt=""
                        loading="lazy"
                        className="h-28 w-full rounded-t-lg object-cover"
                      />
                      <div className="px-2.5 py-2">
                        <p className="truncate text-xs font-medium text-neutral-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
