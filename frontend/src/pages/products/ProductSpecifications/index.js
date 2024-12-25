// src/components/features/products/ProductSpecifications/index.js
import React from 'react';

export function ProductSpecifications({ specifications }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2 border-b">
            <span className="text-gray-600">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSpecifications;