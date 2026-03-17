import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CertificateCard from './CertificateCard';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function CertificatesGrid({ certificates, loading, onCardClick }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 animate-pulse h-[400px]">
                        <div className="aspect-[4/3] bg-slate-800 rounded-xl mb-6" />
                        <div className="h-4 w-20 bg-slate-800 rounded mb-4" />
                        <div className="h-6 w-full bg-slate-800 rounded mb-4" />
                        <div className="h-4 w-2/3 bg-slate-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
            >
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mb-6 border border-slate-800">
                    <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Aucun certificat trouvé</h3>
                <p className="text-slate-400 max-w-xs mx-auto">
                    Il semble que mon "Achievements Vault" soit vide dans cette catégorie. Revenez bientôt !
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            <AnimatePresence mode="popLayout">
                {certificates.map((cert, index) => (
                    <motion.div
                        key={cert.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.05,
                            layout: { duration: 0.4 }
                        }}
                    >
                        <CertificateCard
                            certificate={cert}
                            onClick={onCardClick}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
