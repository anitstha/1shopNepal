import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/public/logo.svg";
import { Mail, Phone } from "lucide-react";
import { categoryApi } from "../../services/api";

const fallbackCategories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Groceries", slug: "groceries" },
  { name: "Beauty", slug: "beauty" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Accessories", slug: "accessories" },
];

const supportLinks = [
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/products" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "My Orders", to: "/orders" },
  { label: "My Account", to: "/account" },
];

const socials = [
  {
    label: "Facebook",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    stroke: true,
  },
  {
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  const footerCategories = categories.length ? categories : fallbackCategories;

  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-10 h-10 bg-white rounded-xl">
                <img src={logo} alt="1ShopNepal" className="w-6 h-6" />
              </span>
              <span className="flex items-baseline gap-1 text-xl font-bold text-white tracking-tight">
                1Shop
                <span className="font-medium text-neutral-400">Nepal</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-neutral-500 max-w-sm">
              Nepal's one-stop online shopping destination. Shop thousands of
              products from the comfort of your home, delivered to your door.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white hover:text-neutral-950 hover:border-white transition-colors"
                >
                  {s.stroke ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d={s.path} />
                    </svg>
                  )}
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              <a
                href="mailto:support@1shopnepal.com"
                className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" /> support@1shopnepal.com
              </a>
              <a
                href="tel:+9779803075499"
                className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" /> +977-9803075499
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Shop / Categories */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                Shop
              </h3>
              <ul className="space-y-2.5">
                {footerCategories.map((cat) => (
                  <li key={cat.slug || cat.name}>
                    <Link
                      to={cat.slug ? `/categories/${cat.slug}` : "/products"}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                Customer Service
              </h3>
              <ul className="space-y-2.5">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-xs text-neutral-600">
          <p>&copy; {new Date().getFullYear()} 1ShopNepal. All rights reserved.</p>
          <p>Proudly made in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;