import { motion } from 'framer-motion';

export default function Section({
    children,
    id,
    className,
    dark = true,
    alternate = false
}) {
    return (
        <section
            id={id}
            className={`
        py-20 md:py-32 relative overflow-hidden
        ${dark ? 'bg-primary text-white' : 'bg-slate-50 text-primary'}
        ${alternate ? 'bg-primary-light/50' : ''}
        ${className}
      `}
        >
            {/* Background Gradients for Tech Look */}
            {dark && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue blur-[120px] rounded-full"></div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </section>
    );
}
