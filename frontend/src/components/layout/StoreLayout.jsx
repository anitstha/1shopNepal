import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Default storefront shell: Navbar on top, page content in the middle,
 * Footer at the bottom. Used as a parent route in AppRoutes.
 */
const StoreLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default StoreLayout;
