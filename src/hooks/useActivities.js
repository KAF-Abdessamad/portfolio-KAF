import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch and manage activities
 */
export const useActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: sbError } = await supabase
                .from('activities')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setActivities(data || []);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return {
        activities,
        loading,
        error,
        refresh: fetchActivities
    };
};

/**
 * Hook for admin to manage all activities (including inactive)
 */
export const useAdminActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllActivities = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: sbError } = await supabase
                .from('activities')
                .select('*')
                .order('order_index', { ascending: true })
                .order('created_at', { ascending: false });

            if (sbError) throw sbError;
            setActivities(data || []);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createActivity = async (activityData) => {
        try {
            const { data, error: sbError } = await supabase
                .from('activities')
                .insert([activityData])
                .select()
                .single();

            if (sbError) throw sbError;
            await fetchAllActivities();
            return { success: true, data };
        } catch (err) {
            console.error('Error creating activity:', err);
            return { success: false, error: err };
        }
    };

    const updateActivity = async (id, updates) => {
        try {
            const { data, error: sbError } = await supabase
                .from('activities')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (sbError) throw sbError;
            await fetchAllActivities();
            return { success: true, data };
        } catch (err) {
            console.error('Error updating activity:', err);
            return { success: false, error: err };
        }
    };

    const deleteActivity = async (id) => {
        try {
            // First get activity to find images to delete
            const { data: activity } = await supabase
                .from('activities')
                .select('images')
                .eq('id', id)
                .single();

            // Delete images from storage
            if (activity?.images?.length > 0) {
                for (const imageUrl of activity.images) {
                    const path = imageUrl.split('/').pop();
                    if (path) {
                        await supabase.storage.from('activities-img').remove([path]);
                    }
                }
            }

            // Delete activity record
            const { error: sbError } = await supabase
                .from('activities')
                .delete()
                .eq('id', id);

            if (sbError) throw sbError;
            await fetchAllActivities();
            return { success: true };
        } catch (err) {
            console.error('Error deleting activity:', err);
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        fetchAllActivities();
    }, [fetchAllActivities]);

    return {
        activities,
        loading,
        error,
        refresh: fetchAllActivities,
        createActivity,
        updateActivity,
        deleteActivity
    };
};
