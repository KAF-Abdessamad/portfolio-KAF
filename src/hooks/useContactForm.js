import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import { CONTACT_CONFIG } from '../lib/constants/contact';

export const useContactForm = () => {
    const { t } = useTranslation();
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

    const validateField = useCallback((name, value) => {
        if (!value.trim()) {
            return 'contact.error_required';
        }
        if (name === 'user_email' && !validateEmail(value)) {
            return 'contact.error_email';
        }
        return '';
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error inline as user types
        if (errors[name]) {
            const errKey = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: errKey }));
        }
    }, [errors, validateField]);

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const errorKey = validateField(key, formData[key]);
            if (errorKey) newErrors[key] = errorKey;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus('loading');

        try {
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
            setStatus('error');
        }

        setTimeout(() => {
            setStatus('idle');
        }, 5000);
    };

    // Translate error keys dynamically so switching language updates displayed errors immediately
    const translatedErrors = Object.fromEntries(
        Object.entries(errors).map(([k, v]) => [k, v ? t(v) : ''])
    );

    return {
        formData,
        errors: translatedErrors,
        status,
        handleChange,
        handleSubmit
    };
};
