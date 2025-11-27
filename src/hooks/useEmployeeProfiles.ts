import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EmployeeProfile } from '../types';

export const useEmployeeProfiles = () => {
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id: string, updates: Partial<EmployeeProfile>) => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProfiles(prev => 
        prev.map(profile => 
          profile.id === id ? { ...profile, ...data } : profile
        )
      );

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employee_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProfiles(prev => prev.filter(profile => profile.id !== id));
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    updateProfile,
    deleteProfile,
  };
};