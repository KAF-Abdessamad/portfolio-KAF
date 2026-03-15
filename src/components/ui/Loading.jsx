import { motion } from 'framer-motion';

export default function Loading({ size = 'md', className }) {
    const sizes = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4",
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`
          ${sizes[size]}
          rounded-full border-secondary border-t-transparent
          shadow-[0_0_15px_rgba(100,255,218,0.2)]
        `}
            />
        </div>
    );
}

// Full page loader variant
export function FullPageLoader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center space-y-4"
        >
            <Loading size="lg" />
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-secondary font-mono text-sm tracking-widest uppercase"
            >
                Initializing Architecture...
            </motion.p>
        </motion.div>
    );
}
