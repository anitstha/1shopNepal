import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

/**
 * Shopping cart state, persisted to localStorage.
 * Items store a snapshot of the product so the cart stays
 * accurate even if a product later changes or is deleted.
 */
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useLocalStorage("cart", []);

  /** Adds a product to the cart (or increases its quantity). */
  const addToCart = (product, qty = 1) =>
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, image: product.images[0], qty },
      ];
    });

  /** Sets an exact quantity for an item (min 1). */
  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
    );

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setItems([]);

  // Derived values
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

/** Hook to access the cart. */
export const useCart = () => useContext(CartContext);
