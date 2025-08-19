import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
const { user, isLoading } = useAuth();

// Show loading spinner while checking authentication
if (isLoading) {
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
);
}

if (!user) {
return <Navigate to="/login" replace />;
}

return <>{children}</>;
};

export default ProtectedRoute;