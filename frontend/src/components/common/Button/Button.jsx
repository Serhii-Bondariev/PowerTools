// // src/components/common/Button/Button.jsx
// import React from 'react';
// import './Button.css';

// export default function Button({
//   children,
//   variant = 'primary',
//   className = '',
//   ...props
// }) {
//   const baseClasses = 'px-4 py-2 rounded-lg transition-colors';
//   const variantClasses = {
//     primary: 'bg-blue-600 text-white hover:bg-blue-700',
//     secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
//     outline: 'border-2 border-gray-300 hover:border-gray-400'
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variantClasses[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }

// src/components/common/Button/Button.jsx
export function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 hover:bg-gray-300',
    outline: 'border border-gray-300 hover:border-gray-400'
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}