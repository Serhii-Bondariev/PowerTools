// src/context/ProductsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    categories: [],
    brands: [],
    rating: 0,
    sortBy: 'featured',
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        // Your product data here
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filteredProducts = products.filter(product => {
    // Apply filters
    return true; // Implement your filter logic
  });

  const value = {
    products: filteredProducts,
    isLoading,
    filters,
    setFilters,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}