// src/services/productService.js
import { Product } from '../models/productModel';

export const productService = {
  async getAllProducts() {
    return await Product.find({});
  },

  async getProductById(id) {
    const product = await Product.findById(id);
    if (product) {
      return product;
    }
    throw new Error('Product not found');
  },

  // Додайте інші методи для роботи з продуктами
};
