import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit2,
    Trash2,
    Calendar,
    MapPin,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    GripVertical,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Info,
    Star
} from 'lucide-react';
import { useAdminActivities } from '../../hooks/useActivities';
import { supabase } from '../../lib/supabase';
import { uploadFile, getPublicUrl, deleteFile } from '../../lib/storage';
import Button from '../../components/ui/Button';

const CATEGORIES = ['Club', 'Competition', 'Event', 'Volunteering'];

export default function ActivitiesPage() {
    const { activities, loading, createActivity, updateActivity, deleteActivity } = useAdminActivities();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Club',
        date_start: '',
        date_end: '',
        location: '',
        images: [],
        cover_image_index: 0,
        is_active: true,
        order_index: 0
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Club',
            date_start: '',
            date_end: '',
            location: '',
            images: [],
            cover_image_index: 0,
            is_active: true,
            order_index: activities.length
        });
        setEditingId(null);
        setIsEditing(false);
        setUploadError(null);
    };

    const startEdit = (activity) => {
        setFormData({
            ...activity,
            cover_image_index: activity.cover_image_index ?? 0,
            date_start: activity.date_start ? new Date(activity.date_start).toISOString().split('T')[0] : '',
            date_end: activity.date_end ? new Date(activity.date_end).toISOString().split('T')[0] : ''
        });
        setEditingId(activity.id);
        setIsEditing(true);
        window.scrollTo(0, 0);
    };

    const handleImageUpload = async (files) => {
        setUploadingImages(true);
        setUploadError(null);

        const uploadedUrls = [];

        for (const file of files) {
            try {
                const fileName = `activity-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const { path, error: storageError } = await uploadFile('activities-img', file, fileName);

                if (storageError) throw storageError;

                const publicUrl = getPublicUrl('activities-img', path);
                uploadedUrls.push(publicUrl);
            } catch (err) {
                console.error('Error uploading image:', err);
                setUploadError(`Erreur lors de l'upload de ${file.name}`);
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedUrls]
        }));
        setUploadingImages(false);
    };

    const removeImage = async (imageUrl, index) => {
        // Remove from storage
        const path = imageUrl.split('/').pop();
        if (path) {
            await deleteFile('activities-img', path);
        }

        // Remove from form data
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const activityData = {
            ...formData,
            date_start: formData.date_start || null,
            date_end: formData.date_end || null
        };

        let result;
        if (editingId) {
            result = await updateActivity(editingId, activityData);
        } else {
            result = await createActivity(activityData);
        }

        if (result.success) {
            resetForm();
            alert(editingId ? 'Activité mise à jour!' : 'Activité créée!');
        } else {
            alert('Erreur lors de la sauvegarde.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;

        const result = await deleteActivity(id);
        if (result.success) {
            alert('Activité supprimée!');
        } else {
            alert('Erreur lors de la suppression.');
        }
    };

    const toggleActive = async (activity) => {
        await updateActivity(activity.id, { is_active: !activity.is_active });
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Activités Parascolaires</h1>
                    <p className="text-text-secondary mt-1">Gérez vos activités, clubs et événements.</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Plus size={18} />
                        Nouvelle activité
                    </Button>
                )}
            </div>

            {/* Form */}
            <AnimatePresence>
                {isEditing && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-bg-card backdrop-blur-xl border border rounded-2xl p-6 space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Modifier l\'activité' : 'Nouvelle activité'}
                            </h2>
                            <button type="button" onClick={resetForm} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        {uploadError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle size={20} />
                                <p>{uploadError}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-text-muted mb-2">Titre</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Catégorie</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Lieu</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                    placeholder="Ex: Université, Club, etc."
                                />
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Date de début</label>
                                <input
                                    type="date"
                                    value={formData.date_start}
                                    onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Date de fin (optionnel)</label>
                                <input
                                    type="date"
                                    value={formData.date_end}
                                    onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-text-muted mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none min-h-[120px]"
                                    required
                                />
                            </div>

                            {/* Images */}
                            <div className="md:col-span-2">
                                <label className="block text-sm text-text-muted mb-2">Images</label>

                                {/* Image Preview Grid with Cover Selection */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {formData.images.map((url, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`relative aspect-video rounded-xl overflow-hidden group cursor-pointer border-2 ${
                                                    formData.cover_image_index === idx 
                                                        ? 'border-amber-500' 
                                                        : 'border-transparent'
                                                }`}
                                                onClick={() => setFormData({ ...formData, cover_image_index: idx })}
                                            >
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                
                                                {/* Cover Badge */}
                                                {formData.cover_image_index === idx && (
                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1">
                                                        <Star size={10} />
                                                        Couverture
                                                    </div>
                                                )}
                                                
                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(url, idx);
                                                        // Reset cover index if needed
                                                        if (formData.cover_image_index === idx) {
                                                            setFormData(prev => ({ ...prev, cover_image_index: 0 }));
                                                        } else if (formData.cover_image_index > idx) {
                                                            setFormData(prev => ({ ...prev, cover_image_index: prev.cover_image_index - 1 }));
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                                
                                                {/* Set as Cover Overlay */}
                                                {formData.cover_image_index !== idx && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs">Cliquer pour couverture</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {formData.images.length > 0 && (
                                    <p className="text-xs text-text-muted mb-3">
                                        <Star size={12} className="inline text-amber-500 mr-1" />
                                        Cliquez sur une image pour la définir comme photo de couverture
                                    </p>
                                )}

                                {/* Upload Button */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages}
                                    className="w-full py-4 border-2 border-dashed border-text-muted/30 rounded-xl flex items-center justify-center gap-2 text-text-muted hover:border-text-accent hover:text-text-accent transition-colors"
                                >
                                    {uploadingImages ? (
                                        <span>Upload en cours...</span>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            <span>Ajouter des images</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Order Index */}
                            <div>
                                <label className="block text-sm text-text-muted mb-2">Ordre d'affichage</label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-bg-surface border border rounded-xl px-4 py-3 text-white focus:border-text-accent focus:outline-none"
                                    min="0"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded border-text-muted"
                                />
                                <label htmlFor="is_active" className="text-white">Actif (visible sur le site)</label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-1">
                                {editingId ? 'Mettre à jour' : 'Créer l\'activité'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={resetForm}>
                                Annuler
                            </Button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Activities List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Liste des activités</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-2 border-text-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        Aucune activité. Cliquez sur "Nouvelle activité" pour commencer.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {activities.map((activity) => (
                            <motion.div
                                key={activity.id}
                                layout
                                className={`bg-bg-card border rounded-xl p-4 flex items-center gap-4 ${
                                    activity.is_active ? 'border-border' : 'border-text-muted/20 opacity-60'
                                }`}
                            >
                                {/* Image thumbnail */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-bg-surface">
                                    {activity.images?.[0] ? (
                                        <img src={activity.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={24} className="text-text-muted" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white truncate">{activity.title}</h3>
                                        <span className="px-2 py-0.5 bg-text-accent/10 text-text-accent text-xs rounded-full">
                                            {activity.category}
                                        </span>
                                    </div>
                                    <p className="text-text-muted text-sm line-clamp-1">{activity.description}</p>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                                        {activity.date_start && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(activity.date_start).toLocaleDateString()}
                                            </span>
                                        )}
                                        {activity.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {activity.location}
                                            </span>
                                        )}
                                        <span>{activity.images?.length || 0} image(s)</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedActivity(activity)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Détails"
                                    >
                                        <Info size={18} />
                                    </button>
                                    <button
                                        onClick={() => toggleActive(activity)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            activity.is_active ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-text-muted hover:bg-white/10'
                                        }`}
                                        title={activity.is_active ? 'Masquer' : 'Afficher'}
                                    >
                                        {activity.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => startEdit(activity)}
                                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(activity.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedActivity(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl max-h-[90vh] bg-bg-card rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedActivity.title}</h2>
                                    <span className="px-2 py-0.5 bg-text-accent/10 text-text-accent text-xs rounded-full">
                                        {selectedActivity.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X size={20} className="text-text-muted" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* Cover Image */}
                                {selectedActivity.images?.length > 0 && (
                                    <div className="mb-6">
                                        <div className="relative aspect-video rounded-xl overflow-hidden">
                                            <img 
                                                src={selectedActivity.images[selectedActivity.cover_image_index ?? 0]} 
                                                alt={selectedActivity.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedActivity.images.length > 1 && (
                                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm">
                                                    {selectedActivity.images.length} images
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Thumbnails */}
                                        {selectedActivity.images.length > 1 && (
                                            <div className="flex gap-2 mt-3 overflow-x-auto">
                                                {selectedActivity.images.map((img, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                                                            (selectedActivity.cover_image_index ?? 0) === idx 
                                                                ? 'border-amber-500' 
                                                                : 'border-transparent'
                                                        }`}
                                                    >
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {selectedActivity.date_start && (
                                        <div className="bg-bg-surface/50 rounded-xl p-4">
                                            <span className="text-xs text-text-muted uppercase">Date</span>
                                            <p className="text-white flex items-center gap-2 mt-1">
                                                <Calendar size={16} className="text-text-accent" />
                                                {new Date(selectedActivity.date_start).toLocaleDateString('fr-FR')}
                                                {selectedActivity.date_end && ` - ${new Date(selectedActivity.date_end).toLocaleDateString('fr-FR')}`}
                                            </p>
                                        </div>
                                    )}
                                    {selectedActivity.location && (
                                        <div className="bg-bg-surface/50 rounded-xl p-4">
                                            <span className="text-xs text-text-muted uppercase">Lieu</span>
                                            <p className="text-white flex items-center gap-2 mt-1">
                                                <MapPin size={16} className="text-text-accent" />
                                                {selectedActivity.location}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="bg-bg-surface/30 rounded-xl p-4">
                                    <span className="text-xs text-text-muted uppercase">Description</span>
                                    <p className="text-text-secondary mt-2 whitespace-pre-wrap">
                                        {selectedActivity.description}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-border bg-bg-surface/30">
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span className={`w-2 h-2 rounded-full ${selectedActivity.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    {selectedActivity.is_active ? 'Active' : 'Inactive'}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => setSelectedActivity(null)}>
                                        Fermer
                                    </Button>
                                    <Button onClick={() => { setSelectedActivity(null); startEdit(selectedActivity); }}>
                                        Modifier
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
