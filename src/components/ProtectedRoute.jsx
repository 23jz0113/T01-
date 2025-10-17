import React from 'react';
import { Navigate } from 'react-router-dom';

// isLoggedInがtrueなら子要素（各ページ）を表示し、falseならログインページ("/")へリダイレクトする
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;