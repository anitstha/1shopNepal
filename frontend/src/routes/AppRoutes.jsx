import { Routes, Route } from "react-router-dom";

// Customer
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";

// Authentication
import Login from "../auth/Login";
import Register from "../auth/Register";

// User
import Profile from "../user/Profile";
import MyOrders from "../user/MyOrders";

// Admin
import Dashboard from "../admin/Dashboard";
import AdminProducts from "../admin/AdminProducts";
import AddProduct from "../admin/AddProduct";
import EditProduct from "../admin/EditProduct";
import Orders from "../admin/Orders";

// 404
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-orders" element={<MyOrders />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      <Route path="/admin/orders" element={<Orders />} />

      {/* Unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;