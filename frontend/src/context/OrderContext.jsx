import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../data/products";

/**
 * Orders placed through checkout.
 * Persisted to localStorage so both the customer ("My Orders")
 * and the admin panel can read them after a reload.
 */
const OrderContext = createContext(null);

/** Possible order statuses shown as badges across the app. */
export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useLocalStorage("orders", []);

  /**
   * Creates an order from the cart contents + shipping info.
   * Returns the created order.
   */
  const placeOrder = ({ items, subtotal, customer, userEmail }) => {
    const deliveryFee =
      subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "pending",
      userEmail,
      customer, // { name, phone, city, address, paymentMethod, notes }
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  };

  /** Admin action: move an order to a new status. */
  const updateOrderStatus = (orderId, status) =>
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

/** Hook to access orders. */
export const useOrders = () => useContext(OrderContext);
