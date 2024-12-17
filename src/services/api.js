// src/services/api.js
import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// src/services/api.js
// export const api = {
//   async getProduct(id) {
//     // API logic
//   },
//   async getRelatedProducts(id) {
//     // API logic
//   }
// };
