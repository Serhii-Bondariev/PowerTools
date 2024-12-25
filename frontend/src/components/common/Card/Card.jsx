// src/components/common/Card/Card.jsx
import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`bg-#ba3f3f rounded-lg shadow-md p-6 ${className}`}>{children}</div>;
}
