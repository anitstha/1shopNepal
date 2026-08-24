import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useCatalog } from "../../context/CatalogContext";
import ProductForm from "./ProductForm";

const AddProduct = () => {
  useDocumentTitle("Add Product");
  const navigate = useNavigate();
  const { addProduct } = useCatalog();

  /** Creates the product and returns to the products table. */
  const handleAdd = (data) => {
    addProduct(data);
    navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <h1 className="mt-4 mb-6 text-2xl font-black tracking-tight text-neutral-950">
        Add New Product
      </h1>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <ProductForm onSubmit={handleAdd} />
      </div>
    </div>
  );
};

export default AddProduct;
