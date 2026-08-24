import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Store,
} from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";

/** Sidebar navigation for the admin panel. */
const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

/**
 * Admin shell with sidebar + access guard.
 * Only logged-in admins can see the nested pages.
 */
const AdminLayout = () => {
  useDocumentTitle("Admin Panel");
  const { user, logout } = useAuth();

  // Access denied view for guests / customers
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-900/5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
            🔒
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Admin access only</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please log in with an administrator account to continue.
          </p>
          <Link
            to="/login"
            state={{ from: "/admin" }}
            className="mt-6 inline-block rounded-lg bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ------------------------- Sidebar ------------------------- */}
      <aside className="flex w-64 shrink-0 flex-col bg-neutral-950 p-5 text-neutral-300 max-lg:hidden">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          1Shop<span className="text-neutral-500">Nepal</span> Admin
        </Link>

        <nav className="mt-8 flex flex-col gap-1" aria-label="Admin">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 font-semibold text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm hover:bg-white/5 hover:text-white"
          >
            <Store className="h-4 w-4" /> Back to Store
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* --------------------- Content area ----------------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top nav (sidebar hidden on small screens) */}
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <Link to="/admin" className="text-sm font-bold">Admin Panel</Link>
          <nav className="flex gap-2">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                aria-label={link.label}
                className={({ isActive }) =>
                  `rounded-lg p-2 ${isActive ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-600"}`
                }
              >
                <link.icon className="h-4 w-4" />
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
