import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { CONTACT_CONFIG } from '../lib/constants/contact';

export const useContactForm = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateField = (name, value) => {
        let error = '';
        if (!value.trim()) {
            error = 'Ce champ est requis';
        } else if (name === 'user_email' && !validateEmail(value)) {
            error = 'Adresse email invalide';
        }
        return error;
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error inline as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    }, [errors]);

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus('loading');

        try {
            // NOTE: En production, assurez-vous que CONTACT_CONFIG contient les vraies clés.
            // Sans clés valides, EmailJS déclenchera une erreur qui sera capturée ici.
            // On envoie formData mais on ajoute aussi 'name', 'nom', et 'email'
            // car votre template EmailJS utilise probablement un de ces noms de variables
            // au lieu de 'user_name' et 'user_email'.
            const payload = {
                ...formData,
                name: formData.user_name,
                nom: formData.user_name,
                from_name: formData.user_name,
                email: formData.user_email,
                reply_to: formData.user_email,
            };

            const result = await emailjs.send(
                CONTACT_CONFIG.SERVICE_ID,
                CONTACT_CONFIG.TEMPLATE_ID,
                payload,
                CONTACT_CONFIG.PUBLIC_KEY
            );

            if (result.text === 'OK') {
                setStatus('success');
                setFormData({ user_name: '', user_email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("EmailJS Error:", error);
            // Forçage de l'erreur pour la démonstration si les clés ne sont pas configurées
            setStatus('error');
        }

        // Réinitialiser le statut après quelques secondes dans tous les cas
        setTimeout(() => {
            setStatus('idle');
        }, 5000);
    };

    return {
        formData,
        errors,
        status,
        handleChange,
        handleSubmit
    };
};
