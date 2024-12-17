// // src/pages/products/ProductsPage.jsx
// import React from 'react';
// import { useProductFilters } from '../../hooks/useProductFilters';
// import { usePagination } from '../../hooks/usePagination';
// import { useLoading } from '../../hooks/useLoading';
// import { useCart } from '../../hooks/useCart';
// import { useResponsive } from '../../hooks/useResponsive';

// export default function ProductsPage() {
//   const isLoading = useLoading();
//   const { isMobile } = useResponsive();

//   const {
//     filters,
//     filteredProducts,
//     updateFilter,
//     clearFilters
//   } = useProductFilters(products);

//   const {
//     currentPage,
//     paginatedItems,
//     goToPage,
//     nextPage,
//     previousPage,
//     totalPages
//   } = usePagination(filteredProducts);

//   const { addToCart } = useCart();

//   // Rest of your component code...
// }

// src/pages/products/ProductPage.jsx
import React from 'react';
import { useProduct } from '../../hooks/useProduct';
import { Card } from '../../components/common/Card';
import { ProductSpecifications } from '../../components/features/products/ProductDetails/components';

export function ProductPage({ productId }) {
  const { product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Тут будуть інші компоненти */}
          </div>
          <ProductSpecifications specifications={product.specifications} />
        </Card>
      </div>
    </div>
  );
}

export default ProductPage;
