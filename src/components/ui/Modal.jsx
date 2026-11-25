import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-5xl',
    closeLabel = 'Close modal'
}) {
    const titleId = useId();
    const closeBtnRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();

    // Prevent scroll when modal is open & focus close button on open
    useEffect(() => {
        if (isOpen) {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            // Focus close button for keyboard accessibility
            const timer = setTimeout(() => {
                closeBtnRef.current?.focus();
            }, 20);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = previousOverflow;
            };
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/70 dark:bg-black/85 backdrop-blur-md"
                        aria-hidden="true"
                    />

                    {/* Modal Container */}
                    <div
                        className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-8 pointer-events-none"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                    >
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 16 }}
                            animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 12 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
                            className={`w-full ${maxWidth} bg-bg-card border border-border-def rounded-2xl sm:rounded-3xl shadow-theme-lg pointer-events-auto overflow-hidden flex flex-col max-h-[92vh] text-text-pri`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 border-b border-border-def bg-bg-surface/70">
                                <h3
                                    id={titleId}
                                    className="text-lg sm:text-xl font-bold text-text-pri tracking-tight leading-snug"
                                >
                                    {title}
                                </h3>
                                <button
                                    ref={closeBtnRef}
                                    type="button"
                                    onClick={onClose}
                                    aria-label={closeLabel}
                                    className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-bg-card border border-border-def text-text-sec hover:text-text-pri hover:border-accent/50 hover:bg-bg-elevated transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
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
