import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/public/logo.svg";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { categoryApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Shop" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setCatOpen(false);
    setUserOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    closeAll();
    navigate(`/products${term ? `?search=${encodeURIComponent(term)}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeAll}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="flex items-center justify-center w-9 h-9">
              <img src={logo} alt="" />
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center ml-6 space-x-1">
            {navLinks.map((link) =>
              link.label === "Categories" ? (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setCatOpen(true)}
                  onMouseLeave={() => setCatOpen(false)}
                >
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600"
                  >
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </Link>
                  {catOpen && (
                    <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/categories/${cat.slug}`}
                          onClick={closeAll}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <span className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-orange-100">
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-orange-600">
                              {cat.name.charAt(0)}
                            </span>
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="relative w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </span>
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-orange-600"
                        : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </div>

          {/* Search (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md ml-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Icons (desktop) */}
          <div className="hidden md:flex items-center ml-4 space-x-1">
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Login / Profile */}
          <div className="hidden md:block ml-2">
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name.split(" ")[0]}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-2">
                    <Link
                      to="/account"
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          onClick={closeAll}
                          className="block px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                        >
                          Admin Dashboard
                        </Link>
                        <div className="py-1">
                          {[
                            { to: "/admin/products", label: "Products" },
                            { to: "/admin/categories", label: "Categories" },
                            { to: "/admin/orders", label: "Orders" },
                            { to: "/admin/users", label: "Users" },
                            { to: "/admin/reviews", label: "Reviews" },
                          ].map((l) => (
                            <Link
                              key={l.to}
                              to={l.to}
                              onClick={closeAll}
                              className="block pl-8 pr-4 py-1.5 text-sm text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                            >
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        closeAll();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-full transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden ml-auto flex items-center space-x-1">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => {
                setMenuOpen((open) => !open);
                setCatOpen(false);
              }}
              className="p-2 text-gray-700"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden pb-2 px-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeAll}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/wishlist"
              onClick={closeAll}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
            {isAuthenticated ? (
              <div className="pt-2 space-y-1 border-t border-gray-100">
                <Link
                  to="/account"
                  onClick={closeAll}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  onClick={closeAll}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      onClick={closeAll}
                      className="block px-3 py-2 rounded-md text-sm font-semibold text-orange-600 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                    {[
                      { to: "/admin/products", label: "Products" },
                      { to: "/admin/categories", label: "Categories" },
                      { to: "/admin/orders", label: "Orders" },
                      { to: "/admin/users", label: "Users" },
                      { to: "/admin/reviews", label: "Reviews" },
                    ].map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={closeAll}
                        className="block pl-8 pr-3 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeAll();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 flex space-x-3">
                <Link
                  to="/login"
                  onClick={closeAll}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeAll}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-600 hover:bg-orange-50 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
