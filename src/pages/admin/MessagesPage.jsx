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
                <MailOpen size={18} className="text-slate-500" />
            ) : (
                <div className="relative">
                    <Mail size={18} className="text-accent" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
            )
        },
        { header: 'Expéditeur', accessor: 'name' },
        { header: 'Sujet', accessor: 'subject' },
        {
            header: 'Date',
            accessor: 'created_at',
            render: (row) => (
                <span className="text-xs font-mono text-slate-500">
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
                    <h1 className="text-3xl font-bold text-white">Messages</h1>
                    <p className="text-slate-400 mt-1">Gérez les demandes de contact reçues via le formulaire.</p>
                </div>

                <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl border border-accent/20 flex items-center gap-2">
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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-secondary border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-primary/20">
                                <h2 className="text-xl font-bold text-white">Détails du message</h2>
                                <button onClick={() => setSelectedMessage(null)} className="p-2 text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Expéditeur</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <User size={16} className="text-accent" />
                                            {selectedMessage.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Email</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <AtSign size={16} className="text-accent" />
                                            {selectedMessage.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Objet</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <ChevronRight size={16} className="text-accent" />
                                            {selectedMessage.subject}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Date</p>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <Calendar size={16} className="text-accent" />
                                            {new Date(selectedMessage.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Message</p>
                                    <div className="bg-primary/40 border border-slate-800 p-6 rounded-2xl text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 flex justify-end bg-primary/20">
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
