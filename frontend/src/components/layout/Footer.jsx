import { Link } from "react-router-dom";
import { categories } from "../../data/categories";
import { headerData } from "../../data/headerData";

/** Quick links grouped in columns for the footer. */
const shopLinks = categories.map((c) => ({
  label: c.name,
  to: `/category/${c.slug}`,
}));

const helpLinks = [
  { label: "My Orders", to: "/my-orders" },
  { label: "My Profile", to: "/profile" },
  { label: "Shopping Cart", to: "/cart" },
];

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img src={headerData.logo} alt={headerData.logoAlt} className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              Online store delivering electronics, fashion and home essentials
              across Nepal.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium text-neutral-900">Shop</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/products" className="text-sm text-neutral-500 hover:text-neutral-900">
                  All Products
                </Link>
              </li>
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-medium text-neutral-900">Account</h3>
            <ul className="mt-3 space-y-2">
              {helpLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-neutral-500">Kathmandu, Nepal</p>
            <p className="mt-1 text-sm text-neutral-500">support@1shopnepal.com</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-neutral-100 pt-5 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} 1ShopNepal
          </p>
          <p className="text-xs text-neutral-400">
            Cash on Delivery · eSewa · Khalti · Bank Transfer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
