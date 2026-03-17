import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { motion } from 'framer-motion';

/**
 * Higher Order Component to protect admin routes.
 * Shows a loading state while checking the session, 
 * redirects to login if not authenticated.
 */
export default function AdminRoute({ children }) {
    const { isAuthenticated, loading } = useAdmin();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
}
