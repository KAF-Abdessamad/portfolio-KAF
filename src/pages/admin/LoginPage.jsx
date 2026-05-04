import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError('Identifiants invalides ou erreur de connexion.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-text-text-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-text-text-secondary/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-bg-card/50 backdrop-blur-xl border border p-8 rounded-2xl shadow-2xl relative z-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Administration</h1>
                        <p className="text-text-secondary">Accédez à votre tableau de bord</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center gap-3 mb-6"
                        >
                            <AlertCircle size={20} />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-bg-surface border border focus:border-text-text-accent rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted/50 outline-none transition-colors"
                                    placeholder="nom@exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-bg-surface border border focus:border-text-text-accent rounded-lg py-3 pl-11 pr-4 text-text-primary placeholder:text-text-muted/50 outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : null}
                            <span>Se connecter</span>
                        </Button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <a href="/" className="text-text-muted hover:text-text-accent transition-colors text-sm">
                        Retour au portfolio
                    </a>
                </div>
            </motion.div>
        </div>
    );
}


