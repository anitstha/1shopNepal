/**
 * Friendly placeholder shown when a list/grid has nothing to display.
 */
const EmptyState = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
      {Icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h3 className="mt-4 text-lg font-bold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default EmptyState;
