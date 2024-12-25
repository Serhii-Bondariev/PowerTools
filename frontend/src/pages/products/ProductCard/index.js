// src/components/features/products/ProductCard/index.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

export function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group">
      <Link to={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <span className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">${product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;