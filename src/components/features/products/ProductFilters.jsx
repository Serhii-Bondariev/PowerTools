// src/components/features/products/ProductFilters.jsx
import React from 'react';
import { FilterX, Star } from 'lucide-react';

export default function ProductFilters({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  selectedRating,
  setSelectedRating,
  categories,
  brands,
  clearFilters,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FilterX className="h-4 w-4 mr-1" />
          Clear
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="price-range-slider"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    );
                  } else {
                    setSelectedCategories([...selectedCategories, category]);
                  }
                }}
                className="filter-checkbox"
              />
              <span className="ml-2 text-sm text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Similar structure for Brands and Rating filters */}
    </div>
  );
}