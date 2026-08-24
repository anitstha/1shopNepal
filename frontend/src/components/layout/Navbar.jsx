import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { headerData, navLinks } from "../../data/headerData";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  /** Submits the search box and moves to the products page. */
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
    setSearchQuery("");
    closeMobileMenu();
  };

  /** Logs out and sends the user back to the home page. */
  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  /** Shared icon-button styles */
  const iconBtn =
    "rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900";

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu}>
          <img
            src={headerData.logo}
            alt={headerData.logoAlt || "Store Logo"}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Right side: navigation + actions */}
        <div className="flex items-center gap-3 sm:gap-5 lg:gap-7">
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-neutral-950"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden items-center rounded-full border border-neutral-200 px-3 sm:flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-28 bg-transparent py-2 text-sm outline-none md:w-36 lg:w-44"
            />
            <button type="submit" aria-label="Search">
              <Search className="h-4 w-4 text-neutral-500" />
            </button>
          </form>

          {/* Account */}
          {user ? (
            // Logged in: go to profile (admin goes straight to dashboard)
            <Link
              to={user.role === "admin" ? "/admin" : "/profile"}
              aria-label="My Account"
              title={`${user.name} — ${user.role}`}
              className="flex items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden lg:inline">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/login" aria-label="Login" className={iconBtn}>
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Cart with item count badge */}
          <Link to="/cart" aria-label="Shopping Cart" className={`relative ${iconBtn}`}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 bottom-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium leading-none text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className={`${iconBtn} md:hidden`}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t border-neutral-100 px-4 py-3 sm:hidden">
        <form onSubmit={handleSearch} className="flex items-center rounded-full border border-neutral-200 px-3">
          <Search className="h-4 w-4 shrink-0 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          />
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium ${
                    isActive
                      ? "bg-neutral-100 font-semibold text-neutral-950"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Account actions for mobile */}
            <hr className="my-2 border-neutral-100" />
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  My Profile
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-lg bg-neutral-950 px-3 py-2.5 text-center text-base font-semibold text-white"
              >
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
