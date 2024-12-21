// frontend/src/pages/admin/AdminProductsPage.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const AdminProductsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              product={editingProduct}
              isEdit={!!editingProduct}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}

      <ProductList onEdit={handleEdit} />
    </div>
  );
};

export default AdminProductsPage;
