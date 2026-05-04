import { motion } from 'framer-motion';

export default function Input({
    label,
    type = 'text',
    placeholder,
    error,
    textarea = false,
    ...props
}) {
    const inputClasses = `
    w-full px-4 py-3 rounded-lg bg-bg-surface border 
    ${error ? 'border-accent' : 'border-border-def'} 
    text-text-pri placeholder:text-text-mut 
    focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent 
    transition-all duration-300
  `;

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-text-sec mb-2">
                    {label}
                </label>
            )}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                {textarea ? (
                    <textarea
                        className={inputClasses}
                        placeholder={placeholder}
                        rows={4}
                        {...props}
                    />
                ) : (
                    <input
                        type={type}
                        className={inputClasses}
                        placeholder={placeholder}
                        {...props}
                    />
                )}
            </motion.div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-text-accent text-xs mt-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}


