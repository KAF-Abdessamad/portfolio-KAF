import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Shield,
    User,
    Palette,
    Globe,
    Save,
    Loader2,
    Lock
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Paramètres enregistrés (démo)");
        }, 1000);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Paramètres</h1>
                    <p className="text-slate-400 mt-1">Configurez les préférences globales de votre portfolio.</p>
                </div>

                <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    <span>Enregistrer les modifications</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Navigation Tabs (Simulated) */}
                <div className="space-y-2">
                    <SettingsTab icon={User} label="Profil" active />
                    <SettingsTab icon={Palette} label="Apparence" />
                    <SettingsTab icon={Globe} label="SEO & Langues" />
                    <SettingsTab icon={Bell} label="Notifications" />
                    <SettingsTab icon={Shield} label="Sécurité" />
                </div>

                {/* Right Column: Active Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Section */}
                    <section className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <User className="text-accent" />
                            <h2 className="text-xl font-bold text-white">Profil de l'administrateur</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Nom complet</label>
                                <input
                                    type="text"
                                    defaultValue="Abdessamad"
                                    className="w-full bg-primary/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-accent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Email public</label>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="w-full bg-primary/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Bio courte (Footer)</label>
                            <textarea
                                rows={3}
                                className="w-full bg-primary/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-accent resize-none"
                                placeholder="Développeur Passionné..."
                            />
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <Lock className="text-red-500" />
                            <h2 className="text-xl font-bold text-white">Authentification & Sécurité</h2>
                        </div>

                        <div className="bg-primary/20 p-6 rounded-2xl border border-slate-800">
                            <p className="text-slate-400 text-sm mb-4">
                                Pour changer votre mot de passe administrateur, veuillez utiliser le tableau de bord Supabase Auth.
                            </p>
                            <a
                                href="https://supabase.com/dashboard"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent text-sm hover:underline font-medium inline-flex items-center gap-1"
                            >
                                Ouvrir Supabase Dashboard <Globe size={14} />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon: Icon, label, active = false }) {
    return (
        <button className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all border ${active
                ? 'bg-accent/10 border-accent/20 text-white'
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
            }`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );
}
