// frontend/src/services/productService.js
import axios from '../utils/axios';

// Отримати всі продукти
export const fetchProducts = async () => {
  const { data } = await axios.get('/api/products');
  return data;
};

// Отримати продукт за ID
export const fetchProductById = async (id) => {
  const { data } = await axios.get(`/api/products/${id}`);
  return data;
};

// Додати новий продукт
export const createProduct = async (product) => {
  const { data } = await axios.post('/api/products', product);
  return data;
};

// Оновити продукт
export const updateProduct = async (id, product) => {
  const { data } = await axios.put(`/api/products/${id}`, product);
  return data;
};

// Видалити продукт
export const deleteProduct = async (id) => {
  const { data } = await axios.delete(`/api/products/${id}`);
  return data;
};
