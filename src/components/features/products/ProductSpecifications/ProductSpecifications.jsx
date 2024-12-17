// src/components/features/products/ProductDetails/components/ProductSpecifications.jsx
import React from 'react';

export function ProductSpecifications({ specifications }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Specifications</h2>
      <div className="border rounded-lg overflow-hidden">
        {Object.entries(specifications).map(([key, value], index) => (
          <div
            key={key}
            className={`flex ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} p-4`}
          >
            <span className="font-medium w-1/3">{key}</span>
            <span className="text-gray-600 w-2/3">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
