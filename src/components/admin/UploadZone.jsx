import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadZone({
    onFileSelected,
    accept = "image/*",
    maxSizeMB = 5,
    preview = null,
    onClear = null
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const validateAndSelect = (file) => {
        setError(null);

        if (!file) return;

        // Type check (basic)
        const isImage = accept.includes('image') && file.type.startsWith('image/');
        const isPdf = accept.includes('pdf') && file.type === 'application/pdf';

        if (!isImage && !isPdf) {
            setError("Format de fichier non supporté.");
            return;
        }

        // Size check
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`Le fichier est trop volumineux (max ${maxSizeMB} Mo).`);
            return;
        }

        onFileSelected(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        validateAndSelect(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        validateAndSelect(file);
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`
                    relative cursor-pointer group border-2 border-dashed rounded-2xl p-8 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px]
                    ${isDragging ? 'bg-accent/10 border-accent' : 'bg-primary/40 border-slate-800 hover:border-slate-600'}
                    ${preview ? 'border-none p-0' : ''}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept={accept}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full aspect-video rounded-xl overflow-hidden group"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {preview.endsWith('.pdf') ? (
                                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4">
                                    <File size={48} className="text-accent mb-2" />
                                    <p className="text-white text-sm font-medium">Document PDF sélectionné</p>
                                </div>
                            ) : (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-all"
                                >
                                    <Upload size={20} />
                                </button>
                                {onClear && (
                                    <button
                                        onClick={onClear}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-500 backdrop-blur-md transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={32} className="text-accent" />
                            </div>
                            <h4 className="text-white font-medium mb-1">
                                {isDragging ? "Déposez ici" : "Cliquez ou glissez un fichier"}
                            </h4>
                            <p className="text-slate-500 text-sm">
                                {accept.includes('image') ? 'PNG, JPG, WebP' : 'PDF'} (Max {maxSizeMB} Mo)
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                    >
                        <AlertCircle size={14} />
                        {error}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
