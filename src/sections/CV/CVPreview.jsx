import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    AlertCircle
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


export default function CVPreview({ fileUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [rotate, setRotate] = useState(0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col h-[85vh] sm:h-[90vh] bg-bg-card backdrop-blur-sm rounded-xl sm:rounded-3xl overflow-hidden border border-border-def">
            {/* Toolbar */}
            <div className="p-2 sm:p-4 bg-bg-surface/50 border-b border flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-mono text-text-pri">
                        {numPages || '?'} pages
                    </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <ZoomOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <span className="text-[10px] sm:text-xs font-mono text-text-mut w-10 sm:w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <ZoomIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <div className="hidden sm:block w-px h-6 bg-border mx-2" />
                    <button
                        onClick={() => setRotate(prev => (prev + 90) % 360)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <RotateCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                </div>
            </div>

            {/* Content View - All Pages */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-8 custom-scrollbar bg-bg-primary flex flex-col items-center gap-4 min-h-[300px] sm:min-h-[400px]">
                {!fileUrl ? (
                    <div className="flex flex-col items-center justify-center h-full text-text-mut space-y-4">
                        <AlertCircle size={48} className="opacity-20" />
                        <p className="font-mono text-sm">Veuillez sélectionner un CV pour prévisualiser</p>
                    </div>
                ) : (
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-2 border-text-accent border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-text-mut font-mono text-xs">Chargement du document...</p>
                            </div>
                        }
                        error={
                            <div className="flex flex-col items-center justify-center py-20 text-red-400 space-y-4">
                                <AlertCircle size={40} />
                                <p className="font-mono text-xs">Erreur lors de l'affichage du PDF</p>
                            </div>
                        }
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} className="shadow-theme-lg border border-border-def/10 rounded-sm overflow-hidden bg-white max-w-full mb-4">
                                <Page
                                    pageNumber={index + 1}
                                    scale={scale}
                                    rotate={rotate}
                                    renderAnnotationLayer={true}
                                    renderTextLayer={true}
                                    className="max-w-full"
                                    width={typeof window !== 'undefined' && window.innerWidth < 640 ? window.innerWidth - 32 : undefined}
                                />
                            </div>
                        ))}
                    </Document>
                )}
            </div>
        </div>
    );
}


