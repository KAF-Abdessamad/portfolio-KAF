import { motion } from 'framer-motion';

export default function Badge({ children, variant = 'primary', className }) {
    const variants = {
        primary: "bg-secondary/10 text-secondary border-secondary/20",
        accent: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
        outline: "bg-transparent text-slate-400 border-slate-700",
    };

    return (
        <motion.span
            whileHover={{ y: -2, scale: 1.05 }}
            className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
        transition-colors duration-300
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </motion.span>
    );
}
