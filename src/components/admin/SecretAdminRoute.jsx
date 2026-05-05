import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { motion } from 'framer-motion';

/**
 * AdminRoute with secret URL protection.
 * Requires both: secret portal access AND Supabase authentication.
 */
export default function SecretAdminRoute({ children }) {
    const { isAuthenticated, loading } = useAdmin();
    const location = useLocation();
    
    // Check if user came through secret portal
    const hasSecretAccess = sessionStorage.getItem('admin_access_granted') === 'true';

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // No secret access - redirect to home (404 style)
    if (!hasSecretAccess) {
        return <Navigate to="/" replace />;
    }

    // Has secret access but not logged in - redirect to admin login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
}
