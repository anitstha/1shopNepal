import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { CatalogProvider } from "./context/CatalogContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

/**
 * Root component.
 * Providers wrap the whole app so every page can read/write
 * auth, catalog, cart and order state.
 */
const App = () => {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <OrderProvider>
            <ScrollToTop />
            <AppRoutes />
          </OrderProvider>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
};

export default App;
