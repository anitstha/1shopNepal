import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useCatalog } from "../../context/CatalogContext";
import ProductForm from "./ProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useCatalog();

  const product = products.find((p) => p.id === Number(id));
  useDocumentTitle(product ? `Edit: ${product.name}` : "Edit Product");

  if (!product) {
    // Unknown id → back to the table
    return <Navigate to="/admin/products" replace />;
  }

  /** Saves changes and returns to the products table. */
  const handleUpdate = (data) => {
    updateProduct(product.id, data);
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
        Edit Product
      </h1>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        {/* Pre-fill the form with existing product data */}
        <ProductForm
          initialData={{
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            oldPrice: product.oldPrice ?? "",
            stock: product.stock,
            rating: product.rating,
            reviews: product.reviews,
            badge: product.badge ?? "",
            description: product.description,
            features: product.features.join(", "),
            image: product.images[0],
            image2: product.images[1] ?? "",
          }}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
};

export default EditProduct;
