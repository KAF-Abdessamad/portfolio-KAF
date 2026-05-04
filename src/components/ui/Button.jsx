import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-accent text-text-inv hover:bg-accent-h shadow-accent font-semibold",
        secondary: "bg-bg-surface text-text-pri hover:bg-bg-elevated border border-border-def font-medium",
        outline: "bg-transparent border-2 border-accent text-text-acc hover:bg-theme-accent hover:text-text-inv",
        ghost: "bg-transparent text-text-mut hover:text-text-pri hover:bg-bg-elevated",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {children}
        </motion.button>
    );
}


