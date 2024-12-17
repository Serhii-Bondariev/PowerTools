// // src/components/common/Input/Input.jsx
// import React from 'react';
// import './Input.css';

// export default function Input({
//   icon: Icon,
//   className = '',
//   ...props
// }) {
//   return (
//     <div className="relative">
//       <input
//         className={`w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
//         {...props}
//       />
//       {Icon && (
//         <Icon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//       )}
//     </div>
//   );
// }
// src/components/common/Input/Input.jsx
export function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <input
        className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {Icon && (
        <Icon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      )}
    </div>
  );
}
