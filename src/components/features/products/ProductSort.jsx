// src/features/products/ProductSort.jsx
export function ProductSort({ value, onChange }) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-2">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-1"
      >
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
