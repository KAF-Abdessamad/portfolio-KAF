import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCertificates = async () => {
            try {
                setLoading(true);
                const { data, error: pbError } = await supabase
                    .from('certificates')
                    .select('*')
                    .order('issue_date', { ascending: false });

                if (pbError) throw pbError;
                if (isMounted) setCertificates(data || []);
            } catch (err) {
                console.error("Error fetching certificates:", err);
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCertificates();

    }, []);

    const filterByCategory = (category) => {
        if (!category || category === 'All') return certificates;
        return certificates.filter(c => c.category === category);
    };

    return { certificates, loading, error, filterByCategory };
};
