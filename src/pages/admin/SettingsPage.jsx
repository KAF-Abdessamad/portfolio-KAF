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
                    <h1 className="text-3xl font-bold text-text-pri">Paramètres</h1>
                    <p className="text-text-sec mt-1">Configurez les préférences globales de votre portfolio.</p>
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
                    <section className="bg-bg-card backdrop-blur-xl border border p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <User className="text-text-acc" />
                            <h2 className="text-xl font-bold text-text-pri">Profil de l'administrateur</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary">Nom complet</label>
                                <input
                                    type="text"
                                    defaultValue="Abdessamad"
                                    className="w-full bg-bg-surface/40 border border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-text-text-accent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary">Email public</label>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="w-full bg-bg-surface/40 border border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-text-text-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-text-secondary">Bio courte (Footer)</label>
                            <textarea
                                rows={3}
                                className="w-full bg-bg-surface/40 border border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-text-text-accent resize-none"
                                placeholder="Développeur Passionné..."
                            />
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-bg-card backdrop-blur-xl border border p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="text-text-acc" />
                            <h2 className="text-xl font-bold text-text-pri">Authentification & Sécurité</h2>
                        </div>

                        <div className="bg-bg-surface/20 p-6 rounded-2xl border border">
                            <p className="text-text-sec text-sm mb-4">
                                Modifiez votre mot de passe pour accéder à la zone d'administration.
                            </p>
                            <button
                                className="text-text-acc text-sm hover:underline font-medium inline-flex items-center gap-1"
                            >
                                Changer le mot de passe
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon: Icon, label, active = false }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${active
                ? 'bg-accent/10 border-accent/20 text-text-pri'
                : 'bg-transparent border-transparent text-text-mut hover:bg-bg-card/40 hover:text-text-pri'
            }`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );
}
