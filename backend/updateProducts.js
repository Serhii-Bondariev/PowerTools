import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/productModel.js';

dotenv.config();

const updateProducts = async () => {
  try {
    // Підключення до бази даних
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Підключено до MongoDB');

    // Отримання всіх продуктів
    const products = await Product.find();

    for (const product of products) {
      // Додавання масиву зображень
      if (!product.image || product.images.length === 0) {
        product.images = [
          '/image/default1.jpg',
          '/image/default2.jpg',
          '/image/default3.jpg',
        ]; // Замініть на ваші дефолтні шляхи до зображень
      }

      // Встановлення бейджів
      if (product.rating >= 4) {
        product.badge = 'Хіт продажів';
      } else if (product.stock > 0 && product.price < 50) {
        product.badge = 'Акція';
      } else {
        product.badge = ''; // Якщо бейдж не потрібен
      }

      // Збереження змін
      await product.save();
    }

    console.log('Продукти успішно оновлені!');
    process.exit();
  } catch (error) {
    console.error('Помилка при оновленні продуктів:', error);
    process.exit(1);
  }
};

// Виклик функції
updateProducts();
