/**
 * Formats a number as a Nepali Rupee price string.
 * Example: 1299 -> "Rs. 1,299"
 */
export const formatPrice = (amount) =>
  `Rs. ${Number(amount ?? 0).toLocaleString("en-IN")}`;

/**
 * Builds a cropped Unsplash image URL from a photo id.
 */
export const unsplash = (photoId, width = 800) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;

/**
 * Calculates the discount percentage between the old and current price.
 */
export const discountPercent = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};
