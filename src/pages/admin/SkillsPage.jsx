import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Zap } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import SkillModal from '../../components/admin/modals/SkillModal';
import { useSkills } from '../../hooks/useSkills';
import { supabase } from '../../lib/supabase';
import { getIcon, getBrandColor } from '../../lib/constants/devicons';

export default function SkillsPage() {
    const { skills, loading, error, refresh } = useSkills();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentSkill(null);
        setIsModalOpen(true);
    };

    const handleEdit = (skill) => {
        setCurrentSkill(skill);
        setIsModalOpen(true);
    };

    const handleDelete = async (skill) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la compétence "${skill.name}" ?`)) return;

        try {
            const { error: deleteError } = await supabase
                .from('skills')
                .delete()
                .eq('id', skill.id);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error("Error deleting skill:", err);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleSave = async (skillData) => {
        try {
            if (currentSkill) {
                // Update
                const { id, created_at, ...updateData } = skillData;
                const { error: updateError } = await supabase
                    .from('skills')
                    .update(updateData)
                    .eq('id', currentSkill.id);

                if (updateError) throw updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('skills')
                    .insert([skillData]);

                if (insertError) throw insertError;
            }
            refresh();
        } catch (err) {
            console.error("Error in handleSave:", err);
            throw err;
        }
    };

    const columns = [
        {
            header: 'Icon',
            accessor: 'icon_key',
            render: (row) => {
                const Icon = getIcon(row.icon_key);
                const color = getBrandColor(row.icon_key, row.color);
                return (
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700" style={{ color }}>
                        {Icon ? <Icon size={24} /> : <Zap size={20} />}
                    </div>
                );
            }
        },
        { header: 'Nom', accessor: 'name' },
        {
            header: 'Catégorie',
            accessor: 'category',
            render: (row) => (
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                    {row.category}
                </span>
            )
        },
        { header: 'Niveau', accessor: 'level' },
        {
            header: 'Featured',
            accessor: 'featured',
            render: (row) => row.featured ? (
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Oui</span>
            ) : (
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Non</span>
            )
        },
        { header: 'Ordre', accessor: 'order_index' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestion des Compétences</h1>
                    <p className="text-slate-400 mt-1">Gérez les technologies et outils affichés sur votre portfolio.</p>
                </div>

                <Button
                    variant="primary"
                    className="flex items-center gap-2 self-start md:self-center"
                    onClick={handleAdd}
                >
                    <Plus size={20} />
                    <span>Nouvelle Compétence</span>
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher une compétence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary/30 border border-slate-800 focus:border-accent rounded-xl py-2.5 pl-10 pr-4 text-white outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <DataTable
                columns={columns}
                data={filteredSkills}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <SkillModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                skill={currentSkill}
                onSave={handleSave}
            />
        </div>
    );
}
