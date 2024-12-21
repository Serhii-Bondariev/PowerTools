// src/hooks/useProductFilters.js
import { useState, useMemo } from 'react';

export function useProductFilters(initialProducts) {
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    categories: [],
    brands: [],
    rating: 0,
    sortBy: 'featured'
  });

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Price Filter
      const withinPriceRange =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      // Category Filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      // Brand Filter
      const matchesBrand =
        filters.brands.length === 0 ||
        filters.brands.includes(product.brand);

      // Rating Filter
      const matchesRating =
        filters.rating === 0 ||
        product.rating >= filters.rating;

      return withinPriceRange && matchesCategory && matchesBrand && matchesRating;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [initialProducts, filters]);

  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 500],
      categories: [],
      brands: [],
      rating: 0,
      sortBy: 'featured'
    });
  };

  return {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters
  };
}
