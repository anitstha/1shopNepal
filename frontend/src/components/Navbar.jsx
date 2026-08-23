import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          1ShopNepal
        </Link>

        {/* Navigation */}
        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <ShoppingCart size={22} />
          </Link>

          <Link to="/login">
            <User size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
