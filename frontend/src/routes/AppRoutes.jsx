import { Routes, Route } from "react-router-dom";

// Layouts
import StoreLayout from "../components/layout/StoreLayout";

// Storefront pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import CategoryList from "../pages/CategoryList";
import CategoryProducts from "../pages/CategoryProducts";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";

// User account pages
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";

// Authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin pages (guarded inside AdminLayout)
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Orders from "../pages/admin/Orders";

// 404
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Storefront — shares the Navbar / Footer layout */}
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Account */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Unknown routes land on the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth pages are standalone (no store chrome) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin panel has its own sidebar layout + access guard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
