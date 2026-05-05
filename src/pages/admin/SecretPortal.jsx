import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY || 'default-secret-123';

export default function SecretPortal() {
    const { secret } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        if (secret === SECRET_KEY) {
            // Store access token
            sessionStorage.setItem('admin_access_granted', 'true');
            setStatus('success');
            setTimeout(() => {
                navigate('/admin');
            }, 1500);
        } else {
            setStatus('denied');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [secret, navigate]);

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {status === 'checking' && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-text-accent border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-text-secondary">Vérification de l'accès...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl mb-4"
                        >
                            🔓
                        </motion.div>
                        <h2 className="text-2xl font-bold text-green-500 mb-2">Accès autorisé</h2>
                        <p className="text-text-secondary">Redirection vers l'administration...</p>
                    </>
                )}

                {status === 'denied' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-6xl mb-4"
                        >
                            🚫
                        </motion.div>
                        <h2 className="text-2xl font-bold text-red-500 mb-2">Accès refusé</h2>
                        <p className="text-text-secondary">Redirection vers l'accueil...</p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
