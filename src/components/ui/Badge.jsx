import { motion } from 'framer-motion';

export default function Badge({ children, variant = 'primary', className }) {
    const variants = {
        primary: "bg-text-acc/10 text-text-acc border-text-acc/20",
        accent: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
        outline: "bg-transparent text-text-mut border-border-def",
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


