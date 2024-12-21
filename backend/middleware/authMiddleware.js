import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // Перевірка наявності токену в заголовках
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];  // Отримуємо токен з заголовка

      // Декодуємо токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Додаємо інформацію про користувача в запит
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Неавторизований' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Неавторизований, немає токену' });
  }
};
