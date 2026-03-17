import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (pbError) throw pbError;
            setMessages(data || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Admin action: Optimistic update when marking read
    const markAsRead = async (id) => {
        // Optimistic UI update
        const originalMessages = [...messages];
        setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));

        try {
            const { error: updateError } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', id);

            if (updateError) throw updateError;
        } catch (err) {
            console.error("Error marking message as read:", err);
            // Revert changes on error
            setMessages(originalMessages);
        }
    };

    return { messages, loading, error, markAsRead, refresh: fetchMessages };
};
