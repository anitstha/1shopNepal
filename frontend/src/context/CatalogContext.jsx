import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { seedProducts } from "../data/products";

/**
 * Holds the product catalog in state (backed by localStorage).
 * Seeded from data/products.js on first load, then editable
 * from the admin panel.
 */
const CatalogContext = createContext(null);

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useLocalStorage("catalog", seedProducts);

  /** Adds a new product and returns it (with a generated id). */
  const addProduct = (data) => {
    const product = { ...data, id: Date.now() };
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  /** Updates an existing product by id. */
  const updateProduct = (id, patch) =>
    setProducts((prev) =>
      prev.map((product) =>
        product.id === Number(id) ? { ...product, ...patch } : product
      )
    );

  /** Removes a product by id. */
  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((product) => product.id !== Number(id)));

  return (
    <CatalogContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </CatalogContext.Provider>
  );
};

/** Hook to access the catalog. */
export const useCatalog = () => useContext(CatalogContext);
