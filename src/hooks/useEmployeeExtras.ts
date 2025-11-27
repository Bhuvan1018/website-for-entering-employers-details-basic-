import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { EmployeePass, HealthRecord, FamilyMember, DutyAssignment } from '../types';

export const useEmployeePasses = (userId?: string) => {
  const [passes, setPasses] = useState<EmployeePass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPasses = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_passes')
        .select('*')
        .eq('user_id', userId)
        .order('expiry_date', { ascending: true });
      if (error) throw error;
      setPasses(data as EmployeePass[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addPass = useCallback(async (payload: Omit<EmployeePass, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('employee_passes')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    setPasses(prev => [...prev, data as EmployeePass]);
    return data as EmployeePass;
  }, []);

  const updatePass = useCallback(async (id: string, updates: Partial<EmployeePass>) => {
    const { data, error } = await supabase
      .from('employee_passes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setPasses(prev => prev.map(p => (p.id === id ? (data as EmployeePass) : p)));
    return data as EmployeePass;
  }, []);

  const deletePass = useCallback(async (id: string) => {
    const { error } = await supabase.from('employee_passes').delete().eq('id', id);
    if (error) throw error;
    setPasses(prev => prev.filter(p => p.id !== id));
  }, []);

  const expiringSoon = useMemo(() => {
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(now.getDate() + 30);
    return passes.filter(p => new Date(p.expiry_date) <= threshold && p.status === 'active');
  }, [passes]);

  useEffect(() => { fetchPasses(); }, [fetchPasses]);

  return { passes, loading, error, refetch: fetchPasses, addPass, updatePass, deletePass, expiringSoon };
};

export const useHealthRecord = (userId?: string) => {
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecord = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      setRecord((data as HealthRecord) || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const upsertRecord = useCallback(async (payload: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('health_records')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw error;
    setRecord(data as HealthRecord);
    return data as HealthRecord;
  }, []);

  useEffect(() => { fetchRecord(); }, [fetchRecord]);

  return { record, loading, error, refetch: fetchRecord, upsertRecord };
};

export const useFamilyMembers = (userId?: string) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMembers(data as FamilyMember[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addMember = useCallback(async (payload: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('family_members')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    setMembers(prev => [data as FamilyMember, ...prev]);
    return data as FamilyMember;
  }, []);

  const updateMember = useCallback(async (id: string, updates: Partial<FamilyMember>) => {
    const { data, error } = await supabase
      .from('family_members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setMembers(prev => prev.map(m => (m.id === id ? (data as FamilyMember) : m)));
    return data as FamilyMember;
  }, []);

  const deleteMember = useCallback(async (id: string) => {
    const { error } = await supabase.from('family_members').delete().eq('id', id);
    if (error) throw error;
    setMembers(prev => prev.filter(m => m.id !== id));
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers, addMember, updateMember, deleteMember };
};

export const useDutyAssignments = (userId?: string) => {
  const [duties, setDuties] = useState<DutyAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDuties = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('duty_assignments')
        .select('*')
        .eq('user_id', userId)
        .order('duty_date', { ascending: true });
      if (error) throw error;
      setDuties(data as DutyAssignment[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addDuty = useCallback(async (payload: Omit<DutyAssignment, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('duty_assignments')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    setDuties(prev => [...prev, data as DutyAssignment]);
    return data as DutyAssignment;
  }, []);

  useEffect(() => { fetchDuties(); }, [fetchDuties]);

  return { duties, loading, error, refetch: fetchDuties, addDuty };
};


