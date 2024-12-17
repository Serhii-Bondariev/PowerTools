import React from 'react';
import { useProductFilters } from '../../hooks/useProductFilters'; // Виправлений шлях
import { usePagination } from '../../hooks/usePagination';
import { useResponsive } from '../../hooks/useResponsive';
import { ProductGrid } from '../../components/features/products/ProductGrid';
import { ProductFilters } from '../../components/features/products/ProductFilters';
import { Pagination } from '../../components/common/Pagination';

const initialProducts = [
  {
    id: 1,
    name: 'Professional Drill Kit',
    price: 299.99,
    category: 'Power Tools',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c'
  },
  // Інші продукти...
];

export function ProductsPage() {
  const { isMobile } = useResponsive();

  const {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters
  } = useProductFilters(initialProducts);

  const {
    currentPage,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    totalPages
  } = usePagination(filteredProducts);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {!isMobile && (
            <ProductFilters
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          )}

          <div className="flex-1">
            <ProductGrid products={paginatedItems} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;