import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "/public/logo.svg";
import { MapPin, Phone, Mail, Globe, AtSign, Share2 } from "lucide-react";
import { categoryApi } from "../../services/api";

const fallbackCategories = [
  "Electronics",
  "Fashion",
  "Groceries",
  "Beauty",
  "Home & Living",
  "Accessories",
];
const supportLinks = [
  { label: "Help Center", to: "/" },
  { label: "Contact Us", to: "/" },
  { label: "Shipping Info", to: "/" },
  { label: "Returns & Refunds", to: "/" },
  { label: "Privacy Policy", to: "/" },
];

function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  const footerCategories = categories.length
    ? categories
    : fallbackCategories.map((name) => ({ name, slug: null }));

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 bg-white">
                <img src={logo} alt="1ShopNepal" />
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Nepal's one-stop online shopping destination. Shop thousands of
              products from the comfort of your home, delivered right to your
              door.
            </p>
            <div className="mt-5 flex space-x-3">
              {[
                { icon: Globe, label: "Website" },
                { icon: AtSign, label: "Email" },
                { icon: Share2, label: "Social" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {footerCategories.map((cat) => (
                <li key={cat.slug || cat.name}>
                  <Link
                    to={cat.slug ? `/categories/${cat.slug}` : "/products"}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-orange-500" />
                Kalimati, Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-orange-500" />
                +977-9803075499
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-orange-500" />
                support@1shopnepal.com
              </li>
            </ul>
            <div className="mt-5 p-3 rounded-xl bg-gray-800">
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-white">Support hours:</span>
                Sun-Fri, 9 AM - 6 PM (NPT)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} 1ShopNepal. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">Proudly made in Nepal 🇳🇵</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
