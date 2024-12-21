// src/services/api.js
import axios from 'axios';
import { MONGO_URI } from '../utils/constants';

const api = axios.create({
  baseURL: MONGO_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
