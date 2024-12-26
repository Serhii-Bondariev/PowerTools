// src/utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо перехоплювач для додавання токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Додаємо перехоплювач для відладки
api.interceptors.request.use((request) => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response);
    return Promise.reject(error);
  }
);

export default api;
