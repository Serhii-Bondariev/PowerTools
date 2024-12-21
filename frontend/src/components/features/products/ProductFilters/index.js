// src/components/features/products/ProductFilters/index.js
import React from 'react';
import { X } from 'lucide-react';

export function ProductFilters({ filters, updateFilter, clearFilters }) {
  return (
    <div className="w-64 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
          Clear all
        </button>
      </div>
      {/* Фільтри */}
    </div>
  );
}

export default ProductFilters;
