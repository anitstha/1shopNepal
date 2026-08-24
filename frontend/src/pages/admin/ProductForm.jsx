import { useState } from "react";
import { categories } from "../../data/categories";

/**
 * Shared form used by both AddProduct and EditProduct.
 * `initialData` is empty for "add" mode; `onSubmit(data)` is called
 * with the cleaned-up values when the form passes validation.
 */
const ProductForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "electronics",
    price: "",
    oldPrice: "",
    stock: "",
    rating: 4.5,
    badge: "",
    description: "",
    features: "",
    image: "",
    image2: "",
    ...initialData,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Validates required fields, then hands clean data to onSubmit. */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.brand || !form.price) {
      setError("Name, brand and price are required.");
      return;
    }
    if (!form.image) {
      setError("A main image URL is required.");
      return;
    }

    onSubmit({
      name: form.name,
      brand: form.brand,
      category: form.category,
      // Numbers come back as strings from inputs — convert them here
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 4.5,
      reviews: initialData?.reviews ?? 0,
      badge: form.badge || null,
      description: form.description,
      // Features entered as comma-separated text
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      images: [form.image, form.image2].filter(Boolean),
    });
  };

  const inputClasses =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10";
  const labelClasses = "mb-1.5 block text-sm font-medium text-neutral-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Basics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>Product name *</label>
          <input id="name" name="name" type="text" value={form.name}
            onChange={handleChange} placeholder="e.g. Wireless Headphones" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="brand" className={labelClasses}>Brand *</label>
          <input id="brand" name="brand" type="text" value={form.brand}
            onChange={handleChange} placeholder="e.g. Sony" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="category" className={labelClasses}>Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className={inputClasses}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="badge" className={labelClasses}>Badge</label>
          <select id="badge" name="badge" value={form.badge ?? ""} onChange={handleChange} className={inputClasses}>
            <option value="">None</option>
            <option value="new">New</option>
            <option value="sale">Sale</option>
          </select>
        </div>
      </div>

      {/* Pricing & stock */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="price" className={labelClasses}>Price (Rs.) *</label>
          <input id="price" name="price" type="number" min="0" value={form.price}
            onChange={handleChange} placeholder="4999" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="oldPrice" className={labelClasses}>Old price</label>
          <input id="oldPrice" name="oldPrice" type="number" min="0" value={form.oldPrice ?? ""}
            onChange={handleChange} placeholder="Optional" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="stock" className={labelClasses}>Stock</label>
          <input id="stock" name="stock" type="number" min="0" value={form.stock}
            onChange={handleChange} placeholder="10" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="rating" className={labelClasses}>Rating (0–5)</label>
          <input id="rating" name="rating" type="number" min="0" max="5" step="0.1"
            value={form.rating} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      {/* Description & features */}
      <div>
        <label htmlFor="description" className={labelClasses}>Description</label>
        <textarea id="description" name="description" rows={3} value={form.description}
          onChange={handleChange} placeholder="Short product description..." className={`${inputClasses} resize-none`} />
      </div>
      <div>
        <label htmlFor="features" className={labelClasses}>
          Features <span className="text-xs text-neutral-400">(comma separated)</span>
        </label>
        <input id="features" name="features" type="text" value={form.features}
          onChange={handleChange} placeholder="Feature one, Feature two, Feature three"
          className={inputClasses} />
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="image" className={labelClasses}>Main image URL *</label>
          <input id="image" name="image" type="url" value={form.image}
            onChange={handleChange} placeholder="https://..." className={inputClasses} />
        </div>
        <div>
          <label htmlFor="image2" className={labelClasses}>Secondary image URL</label>
          <input id="image2" name="image2" type="url" value={form.image2 ?? ""}
            onChange={handleChange} placeholder="https://... (optional)" className={inputClasses} />
        </div>
      </div>

      {/* Image preview */}
      {form.image && (
        <img src={form.image} alt="Preview" className="h-32 w-32 rounded-xl border border-neutral-200 object-cover" />
      )}

      <button
        type="submit"
        className="rounded-xl bg-neutral-950 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
      >
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;
