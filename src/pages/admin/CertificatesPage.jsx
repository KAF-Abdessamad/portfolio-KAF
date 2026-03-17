import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Award, ExternalLink } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/ui/Button';
import CertificateModal from '../../components/admin/modals/CertificateModal';
import { useCertificates } from '../../hooks/useCertificates';
import { supabase } from '../../lib/supabase';

export default function CertificatesPage() {
    const { certificates, loading } = useCertificates();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCert, setCurrentCert] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCerts = certificates.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        setCurrentCert(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cert) => {
        setCurrentCert(cert);
        setIsModalOpen(true);
    };

    const handleDelete = async (cert) => {
        if (!confirm(`Supprimer le certificat "${cert.title}" ?`)) return;

        try {
            const { error: deleteError } = await supabase
                .from('certificates')
                .delete()
                .eq('id', cert.id);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error("Error deleting certificate:", err);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleSave = async (certData) => {
        try {
            if (currentCert) {
                const { id, created_at, ...updateData } = certData;
                const { error: updateError } = await supabase
                    .from('certificates')
                    .update(updateData)
                    .eq('id', currentCert.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('certificates')
                    .insert([certData]);
                if (insertError) throw insertError;
            }
        } catch (err) {
            console.error("Error in handleSave:", err);
            throw err;
        }
    };

    const columns = [
        {
            header: 'Aperçu',
            accessor: 'image_url',
            render: (row) => (
                <div className="w-10 h-10 rounded border border-slate-700 bg-slate-800 overflow-hidden">
                    {row.image_url ? (
                        <img src={row.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Award size={16} />
                        </div>
                    )}
                </div>
            )
        },
        { header: 'Titre', accessor: 'title' },
        { header: 'Émetteur', accessor: 'issuer' },
        {
            header: 'Catégorie',
            accessor: 'category',
            render: (row) => (
                <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/20">
                    {row.category}
                </span>
            )
        },
        { header: 'Date', accessor: 'issue_date' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Certifications</h1>
                    <p className="text-slate-400 mt-1">Gérez vos diplômes et accréditations techniques.</p>
                </div>

                <Button
                    variant="primary"
                    className="flex items-center gap-2 self-start md:self-center"
                    onClick={handleAdd}
                >
                    <Plus size={20} />
                    <span>Ajouter un Certificat</span>
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un certificat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md bg-secondary/30 border border-slate-800 focus:border-accent rounded-xl py-2.5 pl-10 pr-4 text-white outline-none"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredCerts}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(row) => row.credential_url && window.open(row.credential_url, '_blank')}
            />

            <CertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                certificate={currentCert}
                onSave={handleSave}
            />
        </div>
    );
}
