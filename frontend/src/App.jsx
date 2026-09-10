import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import CategoryPage from './pages/CategoryPage'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import PaymentCallback from './pages/PaymentCallback'
import MockKhaltiPage from './pages/MockKhaltiPage'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Account from './pages/Account'

const ContactUs = lazy(() => import('./pages/ContactUs'))
const DataPolicy = lazy(() => import('./pages/DataPolicy'))
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCreateProduct from './pages/admin/AdminCreateProduct'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReviews from './pages/admin/AdminReviews'

function App() {
  return (
    <>
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-950 rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Products />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<ProtectedRoute />}>
          <Route path="" element={<Wishlist />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute />}>
          <Route path="" element={<Checkout />} />
        </Route>
        <Route path="/order-success" element={<ProtectedRoute />}>
          <Route path="" element={<OrderSuccess />} />
        </Route>
        <Route path="/payment/khalti/callback" element={<ProtectedRoute />}>
          <Route path="" element={<PaymentCallback />} />
        </Route>
        <Route path="/payment/khalti/mock" element={<ProtectedRoute />}>
          <Route path="" element={<MockKhaltiPage />} />
        </Route>
        <Route path="/orders" element={<ProtectedRoute />}>
          <Route path="" element={<Orders />} />
        </Route>
        <Route path="/orders/:id" element={<ProtectedRoute />}>
          <Route path="" element={<OrderDetails />} />
        </Route>

        <Route
          element={<ProtectedRoute />}
        >
          <Route path="/account" element={<Account />} />
        </Route>

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<DataPolicy />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<AdminCreateProduct />} />
            <Route path="products/edit/:id" element={<AdminEditProduct />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>
      </Route>
    </Routes>
    </Suspense>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />
    </>
  )
}

export default App
