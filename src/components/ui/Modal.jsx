import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-5xl' }) {
    // Prevent scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 md:p-8 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={`w-full ${maxWidth} bg-[#0D0D0D] border border-white/5 rounded-2xl sm:rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[95vh]`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}


