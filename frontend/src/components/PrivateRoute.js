import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Only allows logged-in users through
export const PrivateRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  return userInfo ? children : <Navigate to="/login" />;
};

// Only allows logged-in admins through
export const AdminRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" />;
};
