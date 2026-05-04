import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import DataTable from '../../components/admin/DataTable';
import ExperienceModal from '../../components/admin/modals/ExperienceModal';
import { useExperience } from '../../hooks/useExperience';

export default function ExperiencePageAdmin() {
    const { experiences, loading, addExperience, updateExperience, deleteExperience } = useExperience();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleSave = async (formData) => {
        if (editingItem?.id) {
            await updateExperience(editingItem.id, formData);
        } else {
            await addExperience(formData);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Supprimer "${item.degree}" ?`)) return;
        setDeletingId(item.id);
        try {
            await deleteExperience(item.id);
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            header: 'Diplôme',
            accessor: 'degree',
            render: (row) => (
                <div className="max-w-xs">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-text-acc/10 text-text-acc rounded-full border border-text-acc/20 mb-1">
                        {row.badge || '—'}
                    </span>
                    <p className="font-medium text-text-primary text-sm leading-snug truncate">{row.degree}</p>
                </div>
            ),
        },
        {
            header: 'École / Établissement',
            accessor: 'school',
            render: (row) => (
                <p className="text-text-sec text-sm truncate max-w-[200px]">{row.school}</p>
            ),
        },
        {
            header: 'Période',
            accessor: 'period',
            render: (row) => (
                <span className="text-text-acc font-mono text-sm">{row.period}</span>
            ),
        },
        {
            header: 'Points clés',
            accessor: 'highlights',
            render: (row) => {
                const items = Array.isArray(row.highlights) ? row.highlights : [];
                return (
                    <div className="flex flex-wrap gap-1">
                        {items.slice(0, 2).map((h, i) => (
                            <span key={i} className="text-[10px] font-mono text-text-mut bg-bg-surface px-2 py-0.5 rounded border border-border-def">
                                {h}
                            </span>
                        ))}
                        {items.length > 2 && (
                            <span className="text-[10px] text-text-mut">+{items.length - 2}</span>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-text-acc/10 flex items-center justify-center">
                        <GraduationCap size={20} className="text-text-acc" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-pri">Gestion "Expérience"</h1>
                        <p className="text-text-sec mt-0.5 text-sm">Gérez votre parcours académique et professionnel affiché dans la timeline.</p>
                    </div>
                </div>
                <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2 self-start">
                    <Plus size={18} />
                    Nouvelle expérience
                </Button>
            </div>

            {/* Info banner when table might not exist yet */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>
                    Les données ci-dessous sont affichées depuis <strong>Supabase</strong> (table <code className="font-mono bg-amber-500/10 px-1 rounded">experiences</code>).
                    Si la table n'existe pas encore, les données par défaut sont affichées. Créez la table via l'éditeur SQL Supabase pour activer la persistance.
                </p>
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={experiences}
                isLoading={loading}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
            />

            {/* Modal */}
            <ExperienceModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                experience={editingItem}
                onSave={handleSave}
            />
        </div>
    );
}
