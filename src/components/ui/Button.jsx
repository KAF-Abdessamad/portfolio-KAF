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
        primary: "bg-secondary text-primary hover:bg-secondary/80 shadow-accent",
        secondary: "bg-primary-light text-white hover:bg-primary-lighter border border-slate-700",
        outline: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary",
        ghost: "text-slate-400 hover:text-white hover:bg-white/10",
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
