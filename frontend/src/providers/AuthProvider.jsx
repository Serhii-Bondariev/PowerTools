// src/providers/AuthProvider.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
