import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, ShieldCheck, Hash, Share2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function CertificateModal({ isOpen, onClose, certificate, onPrev, onNext }) {
    if (!certificate) return null;

    const {
        title,
        issuer,
        issue_date,
        expiry_date,
        credential_id,
        credential_url,
        image_url,
        category,
        description
    } = certificate;

    const formattedDate = new Date(issue_date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const handleShare = () => {
        if (credential_url) {
            navigator.clipboard.writeText(credential_url);
            alert("Lien de vérification copié !");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/90 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl bg-primary-light border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Navigation Buttons */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 hidden md:block">
                            <button onClick={onPrev} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-sm border border-white/10">
                                <ChevronLeft size={24} />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 hidden md:block">
                            <button onClick={onNext} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-sm border border-white/10">
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Top Actions (Mobile & Universal) */}
                        <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                title="Copier le lien"
                            >
                                <Share2 size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Left: Certificate Visual */}
                        <div className="w-full lg:w-3/5 bg-slate-900/50 p-8 flex items-center justify-center min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-slate-800">
                            <div className="relative group w-full max-w-lg">
                                <div className="absolute -inset-4 bg-secondary/20 blur-3xl rounded-full opacity-30" />
                                <motion.img
                                    layoutId={`cert-img-${certificate.id}`}
                                    src={image_url || 'https://via.placeholder.com/600x400?text=Certificate'}
                                    alt={title}
                                    className="relative w-full rounded-xl shadow-2xl border border-white/5 transform hover:scale-[1.02] transition-transform duration-500"
                                />
                                {credential_url && (
                                    <div className="absolute bottom-4 right-4">
                                        <a
                                            href={credential_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 bg-secondary text-primary rounded-xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Info Panel */}
                        <div className="w-full lg:w-2/5 p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                <div>
                                    <span className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-3 block">
                                        Achievement Details
                                    </span>
                                    <h2 className="text-3xl font-bold text-white leading-tight">
                                        {title}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-4 text-slate-400">
                                        <div className="p-2 bg-slate-800 rounded-lg">
                                            <ShieldCheck size={20} className="text-secondary" />
                                        </div>
                                        <span className="text-lg font-medium">{issuer}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 pb-8 border-b border-white/5">
                                    <DetailItem
                                        icon={Calendar}
                                        label="Date d'émission"
                                        value={formattedDate}
                                    />
                                    {credential_id && (
                                        <DetailItem
                                            icon={Hash}
                                            label="ID de certification"
                                            value={credential_id}
                                        />
                                    )}
                                    <DetailItem
                                        icon={Calendar}
                                        label="Expiration"
                                        value={expiry_date ? new Date(expiry_date).toLocaleDateString('fr-FR') : "Aucune"}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-white font-bold flex items-center gap-2">
                                        Description
                                    </h4>
                                    <p className="text-slate-400 leading-relaxed italic">
                                        {description || "Cette certification valide mes compétences techniques et mon expertise dans ce domaine spécifique, démontrant mon engagement envers l'apprentissage continu et l'excellence professionnelle."}
                                    </p>
                                </div>

                                <div className="pt-6 flex flex-col gap-3">
                                    {credential_url && (
                                        <Button
                                            variant="primary"
                                            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
                                            onClick={() => window.open(credential_url, '_blank')}
                                        >
                                            Vérifier l'Accréditation
                                            <ExternalLink size={18} />
                                        </Button>
                                    )}
                                    <button className="w-full py-4 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 border border-slate-800 rounded-2xl hover:bg-white/5">
                                        <Download size={18} />
                                        Télécharger PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1">
                <Icon size={16} className="text-slate-500" />
            </div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm text-slate-200 font-mono">{value}</p>
            </div>
        </div>
    );
}
