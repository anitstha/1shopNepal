import { Star } from "lucide-react";

/**
 * Star rating display (supports half stars).
 * Uses a gold row of stars clipped to the rating percentage,
 * layered over a gray row.
 */
const RatingStars = ({ rating, size = "h-4 w-4" }) => {
  const percent = Math.min(100, Math.max(0, (rating / 5) * 100));

  const row = (className) => (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${size} ${className}`} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );

  return (
    <div className="relative inline-flex w-fit">
      {row("text-neutral-200")}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        {row("text-amber-400")}
      </div>
    </div>
  );
};

export default RatingStars;
