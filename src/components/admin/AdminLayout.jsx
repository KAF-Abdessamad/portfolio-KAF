import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-pri flex flex-col overflow-x-hidden">
            <AdminSidebar />

            <main className="transition-all duration-300 lg:pl-64 min-h-screen p-3 sm:p-6 lg:p-8 flex-1 min-w-0 max-w-full overflow-x-hidden">
                {/* Background decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />
                    <div className="absolute bottom-0 left-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto w-full min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
