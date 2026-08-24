import { Link } from "react-router-dom";

/**
 * Reusable section heading with an optional subtitle
 * and a right-aligned text link.
 */
const SectionHeader = ({ title, subtitle, actionTo, actionLabel }) => {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 max-w-lg text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>

      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          className="shrink-0 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
