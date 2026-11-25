import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function DataTable({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    isLoading = false
}) {
    if (isLoading) {
        return (
            <div className="w-full bg-bg-card border border-border-def rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 shadow-theme-sm">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-text-sec font-mono text-sm">Chargement des données...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full bg-bg-card border border-border-def rounded-2xl p-12 text-center shadow-theme-sm">
                <p className="text-text-mut italic text-sm">Aucune donnée trouvée.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* ── MOBILE CARD VIEW (< 768px) ── */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data.map((row, rowIndex) => (
                    <motion.div
                        key={row.id || rowIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIndex * 0.04 }}
                        className="p-5 rounded-2xl bg-bg-card border border-border-def shadow-theme-sm space-y-3"
                    >
                        {columns.map((col, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm border-b border-border-def/40 pb-2 last:border-b-0 last:pb-0">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-text-mut font-semibold">
                                    {col.header}
                                </span>
                                <div className="text-text-pri font-medium">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </div>
                            </div>
                        ))}

                        {/* Mobile Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-def/60">
                            {onView && (
                                <button
                                    type="button"
                                    onClick={() => onView(row)}
                                    className="p-2 text-text-sec hover:text-text-pri hover:bg-bg-surface rounded-lg transition-all"
                                    title="Voir"
                                >
                                    <ExternalLink size={18} />
                                </button>
                            )}
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() => onEdit(row)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-accent/10 text-text-acc border border-accent/20 hover:bg-accent/20 flex items-center gap-1.5 transition-all"
                                >
                                    <Edit2 size={14} />
                                    <span>Modifier</span>
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(row)}
                                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── DESKTOP & TABLET TABLE VIEW (≥ 768px) ── */}
            <div className="hidden md:block w-full overflow-hidden bg-bg-card border border-border-def rounded-2xl shadow-theme-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-def bg-bg-surface/50">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-4 text-xs font-bold text-text-mut uppercase tracking-widest whitespace-nowrap">
                                        {col.header}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-xs font-bold text-text-mut uppercase tracking-widest text-right whitespace-nowrap">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-def text-sm">
                            {data.map((row, rowIndex) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: rowIndex * 0.03 }}
                                    key={row.id || rowIndex}
                                    className="group hover:bg-bg-surface/40 transition-colors"
                                >
                                    {columns.map((col, i) => (
                                        <td key={i} className="px-6 py-4 text-text-pri">
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onView && (
                                                <button
                                                    type="button"
                                                    onClick={() => onView(row)}
                                                    className="p-2 text-text-sec hover:text-text-pri hover:bg-bg-surface rounded-lg transition-all"
                                                    title="Voir"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(row)}
                                                    className="p-2 text-text-sec hover:text-text-acc hover:bg-accent/10 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(row)}
                                                    className="p-2 text-text-sec hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
