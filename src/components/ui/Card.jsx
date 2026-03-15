import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Card({
    children,
    className,
    hover = true,
    glass = false,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -10, transition: { duration: 0.3 } } : {}}
            className={cn(
                "relative rounded-2xl p-6 bg-primary-light border border-slate-800 shadow-premium overflow-hidden",
                glass && "bg-opacity-20 backdrop-blur-md border-white/10",
                className
            )}
            {...props}
        >
            {/* Subtle Glow Effect */}
            {hover && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent-blue opacity-0 group-hover:opacity-20 transition duration-500 rounded-2xl blur"></div>
            )}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
