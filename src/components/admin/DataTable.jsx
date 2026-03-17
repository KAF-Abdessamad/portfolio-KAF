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
            <div className="w-full bg-secondary/20 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-mono text-sm">Chargement des données...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full bg-secondary/20 border border-slate-800 rounded-2xl p-12 text-center">
                <p className="text-slate-500 italic">Aucune donnée trouvée.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden bg-secondary/30 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-primary/40">
                            {columns.map((col, i) => (
                                <th key={i} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((row, rowIndex) => (
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: rowIndex * 0.05 }}
                                key={row.id || rowIndex}
                                className="group hover:bg-white/[0.02] transition-colors"
                            >
                                {columns.map((col, i) => (
                                    <td key={i} className="px-6 py-4 text-white">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {onView && (
                                            <button
                                                onClick={() => onView(row)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                                                title="Voir"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                                                title="Modifier"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(row)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
    );
}
