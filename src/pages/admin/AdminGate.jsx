import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '123456';

export default function AdminGate() {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Check if already has access
    useEffect(() => {
        if (sessionStorage.getItem('admin_access_granted') === 'true') {
            navigate('/admin');
        }
    }, [navigate]);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError(false);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }

        // Check if all filled
        if (index === 5 && value) {
            const fullPin = [...newPin.slice(0, 5), value].join('');
            validatePin(fullPin);
        }
    };

    const validatePin = (fullPin) => {
        if (fullPin === ADMIN_PIN) {
            setSuccess(true);
            sessionStorage.setItem('admin_access_granted', 'true');
            setTimeout(() => navigate('/admin'), 500);
        } else {
            setError(true);
            setPin(['', '', '', '', '', '']);
            document.getElementById('pin-0')?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            prevInput?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center"
            >
                <div className="bg-bg-card/50 backdrop-blur-xl border border rounded-2xl p-8 shadow-2xl">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-accent" size={28} />
                    </div>

                    <h1 className="text-2xl font-bold text-text-primary mb-2">Accès Restreint</h1>
                    <p className="text-text-secondary mb-8">Entrez le code PIN à 6 chiffres</p>

                    <div className="flex justify-center gap-2 mb-6">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${index}`}
                                type="password"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-12 h-14 text-center text-2xl font-bold bg-bg-surface border-2 rounded-lg outline-none transition-all ${
                                    error 
                                        ? 'border-red-500 text-red-500' 
                                        : success
                                            ? 'border-green-500 text-green-500'
                                            : 'border focus:border-accent text-text-primary'
                                }`}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm mb-4"
                        >
                            Code incorrect
                        </motion.p>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center gap-2 text-green-500 mb-4"
                        >
                            <span>Accès accordé</span>
                            <ArrowRight size={18} />
                        </motion.div>
                    )}
                </div>

                <a 
                    href="/" 
                    className="inline-block mt-6 text-text-muted hover:text-accent transition-colors text-sm"
                >
                    Retour au portfolio
                </a>
            </motion.div>
        </div>
    );
}
