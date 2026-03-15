import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useContactForm } from '../../hooks/useContactForm';

const InputField = ({ label, name, type = 'text', value, onChange, error, multiline = false }) => {
    return (
        <div className="relative mb-6">
            <label htmlFor={name} className="block text-sm font-mono text-slate-400 uppercase tracking-widest mb-2">
                {label}
            </label>
            <div className="relative">
                {multiline ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        rows={5}
                        className={`w-full bg-primary/50 text-white rounded-xl px-4 py-3 border ${error ? 'border-red-500' : 'border-white/10'
                            } outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] resize-none`}
                        placeholder={`Votre ${label.toLowerCase()}...`}
                    />
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`w-full bg-primary/50 text-white rounded-xl px-4 py-3 border ${error ? 'border-red-500' : 'border-white/10'
                            } outline-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)]`}
                        placeholder={`Votre ${label.toLowerCase()}...`}
                    />
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-6 left-1 text-xs text-red-500 font-mono flex items-center"
                    >
                        <AlertCircle size={12} className="mr-1" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

const ContactForm = () => {
    const { formData, errors, status, handleChange, handleSubmit } = useContactForm();

    const isSending = status === 'loading';
    const isSuccess = status === 'success';
    const isError = status === 'error';

    return (
        <div className="p-8 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden h-full flex flex-col justify-center">

            <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField
                        label="Nom complet"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        error={errors.user_name}
                    />
                    <InputField
                        label="Email"
                        name="user_email"
                        type="email"
                        value={formData.user_email}
                        onChange={handleChange}
                        error={errors.user_email}
                    />
                </div>

                <InputField
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                />

                <InputField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    multiline
                />

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSending}
                        className="group relative w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-white font-bold text-lg focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    >
                        {/* Magnetic/Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#00f0ff] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                        <span className="relative flex items-center justify-center w-full">
                            {isSending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Envoi en cours...
                                </>
                            ) : isSuccess ? (
                                <>
                                    <CheckCircle2 className="mr-2" size={20} />
                                    Message envoyé !
                                </>
                            ) : isError ? (
                                <>
                                    <AlertCircle className="mr-2" size={20} />
                                    Erreur, réessayez
                                </>
                            ) : (
                                <>
                                    Envoyer le message
                                    <Send className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                                </>
                            )}
                        </span>
                    </button>

                    <AnimatePresence>
                        {isError && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-center text-sm font-mono mt-4"
                            >
                                Veuillez vérifier votre configuration EmailJS (Clés manquantes).
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
