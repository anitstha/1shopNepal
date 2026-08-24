import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useCatalog } from "../../context/CatalogContext";
import { formatPrice } from "../../utils/format";

const AdminProducts = () => {
  useDocumentTitle("Manage Products");
  const { products, deleteProduct } = useCatalog();
  const [search, setSearch] = useState("");

  // Simple name/brand search over the table
  const visible = products.filter((p) =>
    `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase())
  );

  /** Deletes after an explicit confirmation. */
  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black tracking-tight text-neutral-950">Products</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-48 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Products table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-4 py-4 font-semibold">Category</th>
              <th className="px-4 py-4 font-semibold">Price</th>
              <th className="px-4 py-4 font-semibold">Stock</th>
              <th className="px-4 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {visible.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="max-w-[220px] truncate font-semibold text-neutral-900">{product.name}</p>
                      <p className="text-xs text-neutral-400">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-neutral-600">{product.category.replace("-", " & ")}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : product.stock <= 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      aria-label={`Edit ${product.name}`}
                      className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-400">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
