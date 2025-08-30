import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  // You can add any additional props you might need, e.g., requiredRole
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want to show a loading spinner here
    return <div>Loading authentication state...</div>;
  }

  if (!user) {
    // User not authenticated, redirect to login page
    // Pass the current location so we can redirect back after login (optional)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
