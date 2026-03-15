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
    w-full px-4 py-3 rounded-lg bg-primary-lighter border 
    ${error ? 'border-accent-pink' : 'border-slate-700'} 
    text-white placeholder:text-slate-500 
    focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary 
    transition-all duration-300
  `;

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-slate-300 mb-2">
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
                    className="text-accent-pink text-xs mt-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
