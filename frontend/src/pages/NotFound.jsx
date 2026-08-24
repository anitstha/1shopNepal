import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-5xl font-semibold tracking-tight text-neutral-900">404</h1>
      <p className="mt-3 text-sm text-neutral-500">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Back to home
        </Link>
        <Link
          to="/products"
          className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
