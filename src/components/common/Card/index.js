// src/components/common/Card/index.js
import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}

export default Card;