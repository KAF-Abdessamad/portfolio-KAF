import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    MailOpen,
    Trash2,
    Calendar,
    User,
    AtSign,
    ChevronRight,
    X,
    Inbox
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import { useMessages } from '../../hooks/useMessages';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

export default function MessagesPage() {
    const { messages, loading, markAsRead, refresh } = useMessages();
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleDelete = async (message) => {
        if (!confirm(`Supprimer le message de ${message.name} ?`)) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', message.id);

            if (error) throw error;
            refresh();
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Erreur lors de la suppression.");
        }
    };

    const handleView = (message) => {
        setSelectedMessage(message);
        if (!message.is_read) {
            markAsRead(message.id);
        }
    };

    const columns = [
        {
            header: 'Statut',
            accessor: 'is_read',
            render: (row) => row.is_read ? (
                <MailOpen size={18} className="text-text-muted" />
            ) : (
                <div className="relative">
                    <Mail size={18} className="text-text-accent" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-text-text-accent rounded-full animate-pulse" />
                </div>
            )
        },
        { header: 'Expéditeur', accessor: 'name' },
        { header: 'Sujet', accessor: 'subject' },
        {
            header: 'Date',
            accessor: 'created_at',
            render: (row) => (
                <span className="text-xs font-mono text-text-muted">
                    {new Date(row.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Messages</h1>
                    <p className="text-text-secondary mt-1">Gérez les demandes de contact reçues via le formulaire.</p>
                </div>

                <div className="bg-text-text-accent/10 text-text-accent px-4 py-2 rounded-xl border border-text-text-accent/20 flex items-center gap-2">
                    <Inbox size={20} />
                    <span className="font-bold">{messages.filter(m => !m.is_read).length} non lus</span>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={messages}
                isLoading={loading}
                onView={handleView}
                onDelete={handleDelete}
            />

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                            className="absolute inset-0 bg-bg-primary/95 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-bg-surface border border rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border flex items-center justify-between bg-bg-card/20">
                                <h2 className="text-xl font-bold text-text-primary">Détails du message</h2>
                                <button onClick={() => setSelectedMessage(null)} className="p-2 text-text-secondary hover:text-text-primary">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Expéditeur</p>
                                        <div className="flex items-center gap-2 text-text-primary font-medium">
                                            <User size={16} className="text-text-accent" />
                                            {selectedMessage.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Email</p>
                                        <div className="flex items-center gap-2 text-text-primary font-medium">
                                            <AtSign size={16} className="text-text-accent" />
                                            {selectedMessage.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Objet</p>
                                        <div className="flex items-center gap-2 text-text-primary font-medium">
                                            <ChevronRight size={16} className="text-text-accent" />
                                            {selectedMessage.subject}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Date</p>
                                        <div className="flex items-center gap-2 text-text-primary font-medium">
                                            <Calendar size={16} className="text-text-accent" />
                                            {new Date(selectedMessage.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border">
                                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-4">Message</p>
                                    <div className="bg-bg-card/40 border border p-6 rounded-2xl text-text-secondary leading-relaxed max-h-[300px] overflow-y-auto">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border flex justify-end bg-bg-card/20">
                                <Button
                                    variant="secondary"
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-8"
                                >
                                    Fermer
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


