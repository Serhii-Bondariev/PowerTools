// frontend/src/pages/admin/ProductForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, editProduct } from '../../store/slices/productsSlice';

const ProductForm = ({ product = null, isEdit = false, onClose }) => {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      price: '',
      category: '',
      description: '',
      countInStock: '',
      image: '',
    }
  );

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(editProduct({ id: product._id, product: formData })).unwrap();
      } else {
        await dispatch(addProduct(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={formData.countInStock}
            onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select category</option>
          <option value="Power Tools">Power Tools</option>
          <option value="Hand Tools">Hand Tools</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
