import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import logo from "/logo1.png";
import { Link } from "react-router-dom";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-border px-6 lg:px-16 py-3 transition-all">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img className="h-9 w-9 object-contain" src={logo} alt="1shopNepal" />

          <div className="font-bold text-2xl tracking-tight text-fg group-hover:text-primary transition-colors">
            1shop<span className="text-primary">Nepal</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:block">
          <div className="flex items-center gap-1 bg-primary text-primary-fg py-1.5 px-3 rounded-full shadow-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium rounded-full hover:bg-white/15 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Shop Now Button */}
          <Link to="/cart">
            <button className="hidden sm:flex items-center gap-2 bg-primary text-primary-fg hover:opacity-90 font-medium text-sm px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-95">
              <ShoppingBag size={16} />
              <span>Shop Now</span>
            </button>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-full bg-card border border-border text-fg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full md:hidden bg-bg/95 backdrop-blur-md border-b border-border p-3 shadow-lg">
          <div className="flex flex-col gap-1 bg-card border border-border rounded-radius p-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-fg hover:text-primary hover:bg-muted rounded-radius transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
