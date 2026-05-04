import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
    Loader2,
    ZoomIn,
    ZoomOut,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Search,
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
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [rotate, setRotate] = useState(0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const changePage = (offset) => {
        setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
    };

    return (
        <div className="flex flex-col h-full bg-bg-card backdrop-blur-sm rounded-3xl overflow-hidden border border-border-def">
            {/* Toolbar */}
            <div className="p-4 bg-bg-surface/50 border-b border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg hover:bg-bg-surface disabled:opacity-30 text-text-pri transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-mono text-text-pri">
                        Page {pageNumber} sur {numPages || '?'}
                    </span>
                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg hover:bg-bg-surface disabled:opacity-30 text-text-pri transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                        className="p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-xs font-mono text-text-mut w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                        className="p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <div className="w-px h-6 bg-border mx-2" />
                    <button
                        onClick={() => setRotate(prev => (prev + 90) % 360)}
                        className="p-2 rounded-lg hover:bg-bg-surface text-text-pri transition-colors"
                    >
                        <RotateCw size={18} />
                    </button>
                </div>
            </div>

            {/* Content View */}
            <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-bg-primary flex justify-center items-start min-h-[500px]">
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
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="animate-spin text-text-acc" size={40} />
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
                        <div className="shadow-theme-lg border border-border-def/10 rounded-sm overflow-hidden bg-white">
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                rotate={rotate}
                                renderAnnotationLayer={true}
                                renderTextLayer={true}
                            />
                        </div>
                    </Document>
                )}
            </div>
        </div>
    );
}


