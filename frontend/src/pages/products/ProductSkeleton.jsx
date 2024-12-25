// src/features/products/ProductSkeleton.jsx
import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Category */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />

        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-16 ml-2" />
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-10 w-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}