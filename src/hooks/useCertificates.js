import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('certificates')
                .select('*')
                .order('issue_date', { ascending: false });

            if (pbError) throw pbError;
            setCertificates(data || []);
        } catch (err) {
            console.error("Error fetching certificates:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const filterByCategory = (category) => {
        if (!category || category === 'All') return certificates;
        return certificates.filter(c => c.category === category);
    };

    return { certificates, loading, error, filterByCategory, refresh: fetchCertificates };
};
