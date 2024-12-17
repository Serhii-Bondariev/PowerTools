структура :
src/
├── components/
│   ├── common/          # Загальні компоненти
│   │   ├── Button/
│   │   │   └── index.jsx
│   │   ├── Card/
│   │   │   └── index.jsx
│   │   ├── Input/
│   │   │   └── index.jsx
│   │   ├── LanguageSwitcher/
│   │   │   └── index.jsx
│   │   └── Pagination/
│   │       └── index.jsx
│   ├── features/        # Функціональні компоненти
│   │   ├── cart/
│   │   │   ├── CartItem/
│   │   │   ├── CartList/
│   │   │   └── CartSummary/
│   │   ├── products/
│   │   │   ├── ProductCard/
│   │   │   ├── ProductDetails/
│   │   │   ├── ProductFilters/
│   │   │   ├── ProductGrid/
│   │   │   └── ProductSort/
│   │   └── newsletter/
│   │       └── NewsletterForm/
│   └── layout/         # Компоненти макету
│       ├── Footer/
│       ├── Header/
│       └── MainLayout/
├── pages/             # Сторінки
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── cart/
│   │   └── CartPage.jsx
│   ├── home/
│   │   └── HomePage.jsx
│   └── products/
│       └── ProductsPage.jsx
├── hooks/            # Кастомні хуки
├── store/            # Redux store
│   ├── slices/
│   └── index.js
├── utils/            # Утиліти
│   ├── constants.js
│   └── formatters.js
├── services/         # API сервіси
├── styles/          # Глобальні стилі
└── App.jsx