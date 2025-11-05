import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userProfile } = useContext(AuthContext);

  if (!isAuthenticated) {
    // If not authenticated, redirect to the home page.
    // The AuthModal can be triggered from there.
    return <Navigate to="/" replace />;
  }

  const userRole = userProfile?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If the user's role is not allowed, redirect them to their default dashboard.
    const redirectPath = userRole === 'custodian' ? '/custodian-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and role is allowed, render the child routes.
  return <Outlet />;
};

export default ProtectedRoute;