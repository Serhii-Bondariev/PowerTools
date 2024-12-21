// src/components/features/products/ProductFilters.jsx
import React from 'react';
import { X } from 'lucide-react';

export function ProductFilters({ filters, updateFilter, clearFilters }) {
  const categories = [
    'all',
    'Power Tools',
    'Paint & Supplies',
    'Measuring Tools',
    'Plumbing'
  ];

  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200-plus' }
  ];

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Category</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => updateFilter('category', category)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 capitalize">
                  {category === 'all' ? 'All Categories' : category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="font-medium mb-4">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange === range.value}
                  onChange={() => updateFilter('priceRange', range.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => updateFilter('inStock', e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}