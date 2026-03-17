import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ExternalLink } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import ProjectModal from '../../components/admin/modals/ProjectModal';
import { useProjects } from '../../hooks/useProjects';
import { supabase } from '../../lib/supabase';

export default function ProjectsPage() {
    const { projects, loading, error } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (project) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.title}" ?`)) return;

        try {
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', project.id);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleSave = async (projectData) => {
        try {
            if (currentProject) {
                // Update
                const { id, created_at, ...updateData } = projectData;
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(updateData)
                    .eq('id', currentProject.id);

                if (updateError) throw updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([projectData]);

                if (insertError) throw insertError;
            }
        } catch (err) {
            console.error("Error in handleSave:", err);
            throw err;
        }
    };

    const columns = [
        {
            header: 'Image',
            accessor: 'image_url',
            render: (row) => (
                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                    {row.image_url ? (
                        <img src={row.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Plus size={16} />
                        </div>
                    )}
                </div>
            )
        },
        { header: 'Titre', accessor: 'title' },
        {
            header: 'Catégorie',
            accessor: 'category',
            render: (row) => (
                <span className="px-2 py-1 rounded bg-accent/10 text-accent text-xs font-medium border border-accent/20">
                    {row.category}
                </span>
            )
        },
        {
            header: 'Featured',
            accessor: 'featured',
            render: (row) => row.featured ? (
                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Oui</span>
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
                    <h1 className="text-3xl font-bold text-white">Gestion des Projets</h1>
                    <p className="text-slate-400 mt-1">Créez, modifiez et organisez vos réalisations.</p>
                </div>

                <Button
                    variant="primary"
                    className="flex items-center gap-2 self-start md:self-center"
                    onClick={handleAdd}
                >
                    <Plus size={20} />
                    <span>Nouveau Projet</span>
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-secondary/30 border border-slate-800 focus:border-accent rounded-xl py-2.5 pl-10 pr-4 text-white outline-none"
                    />
                </div>
            </div>

            {/* List */}
            <DataTable
                columns={columns}
                data={filteredProjects}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(row) => window.open(row.live_url || row.github_url, '_blank')}
            />

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={currentProject}
                onSave={handleSave}
            />
        </div>
    );
}
