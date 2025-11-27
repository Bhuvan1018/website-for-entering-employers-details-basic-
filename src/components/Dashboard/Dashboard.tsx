import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { EmployeeProfile } from '../../types';
import ProfileCard from './ProfileCard';
import EditProfileModal from './EditProfileModal';
import CreateProfileForm from './CreateProfileForm';
import Clock from './Clock';
import { useEmployeePasses, useFamilyMembers, useHealthRecord, useDutyAssignments } from '../../hooks/useEmployeeExtras';
import { uploadFamilyImage } from '../../utils/storage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { passes, expiringSoon } = useEmployeePasses(user?.id);
  const { record } = useHealthRecord(user?.id);
  const { members, addMember } = useFamilyMembers(user?.id);
  const { duties } = useDutyAssignments(user?.id);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile from user metadata if it doesn't exist
        await createProfileFromUserData();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfileFromUserData = async () => {
    try {
      const userData = user.user_metadata;
      const profileData = {
        user_id: user.id,
        full_name: userData.full_name || '',
        employee_id: userData.employee_id || '',
        cadre: userData.cadre || 'Skilled',
        department: userData.department || 'Operations',
        division: userData.division || 'Central Railway',
        designation: userData.designation || '',
        date_of_birth: userData.date_of_birth || '',
        date_of_joining: userData.date_of_joining || '',
        phone_number: userData.phone_number || '',
        address: userData.address || '',
      };

      const { data, error } = await supabase
        .from('employee_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
      // If profile creation fails, show a helpful message
      setProfile(null);
    }
  };

  const handleProfileUpdate = (updatedProfile: EmployeeProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-overlay rounded-xl shadow-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your profile and view your information</p>
        </div>

        <Clock />

        {profile ? (
          <>
            <ProfileCard 
              profile={profile} 
              onEditClick={() => setIsEditModalOpen(true)} 
            />
            
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              profile={profile}
              onUpdate={handleProfileUpdate}
            />
            {/* Duty section */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Duty Allocation</h2>
              {duties && duties.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {duties.map(d => (
                    <div key={d.id} className="bg-white rounded-md border p-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-blue-900">{d.title}</div>
                          <div className="text-sm text-gray-600">{d.location || '—'} | {new Date(d.duty_date).toDateString()} {d.shift ? `• ${d.shift}` : ''}</div>
                        </div>
                        <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">Duty allotted</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-2">No duties assigned.</p>
              )}
            </section>

            {/* Passes section */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Pass Eligibility & Travel</h2>
              {expiringSoon.length > 0 && (
                <div className="text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded p-2 mt-2">
                  {expiringSoon.length} pass(es) expiring within 30 days. Please renew.
                </div>
              )}
              <div className="mt-3 space-y-2">
                {passes.map(p => (
                  <div key={p.id} className="bg-white rounded-md border p-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <div className="font-medium text-blue-900">{p.pass_type} • {p.train_type}</div>
                        <div className="text-sm text-gray-600">{p.origin} → {p.destination}</div>
                      </div>
                      <div className="text-right text-sm text-gray-700">
                        <div>Issued: {new Date(p.issue_date).toLocaleDateString()}</div>
                        <div>Expires: {new Date(p.expiry_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {passes.length === 0 && (
                  <p className="text-sm text-gray-600">No passes found.</p>
                )}
              </div>
            </section>

            {/* Health section */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Health Details</h2>
              {record ? (
                <div className="bg-white rounded-md border p-3 mt-3 text-sm text-gray-800">
                  <div>Blood group: {record.blood_group || '—'}</div>
                  <div>Allergies: {record.allergies || '—'}</div>
                  <div>Chronic conditions: {record.chronic_conditions || '—'}</div>
                  <div>Last medical: {record.last_medical_check ? new Date(record.last_medical_check).toLocaleDateString() : '—'}</div>
                  <div>Next due: {record.next_medical_due ? new Date(record.next_medical_due).toLocaleDateString() : '—'}</div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-2">No health record added.</p>
              )}
            </section>

            {/* Family section */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Family Details</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map(m => (
                  <div key={m.id} className="bg-white rounded-md border p-3 flex items-center gap-3">
                    <img src={m.profile_image_url || 'https://placehold.co/64x64?text=👤'} alt={m.full_name} className="h-16 w-16 rounded-full object-cover bg-gray-100" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">{m.full_name}</div>
                      <div className="text-sm text-gray-600 capitalize">{m.relation}</div>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-gray-600">No family members added.</p>
                )}
              </div>
              {/* Simple uploader */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add family member image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !user) return;
                    const url = await uploadFamilyImage(file, user.id);
                    await addMember({
                      user_id: user.id,
                      full_name: file.name.replace(/\.[^/.]+$/, ''),
                      relation: 'other',
                      profile_image_url: url || undefined,
                      date_of_birth: undefined,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      id: '' as any,
                    } as any);
                  }}
                  className="block w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG/PNG/SVG.</p>
              </div>
            </section>
          </>
        ) : (
          <CreateProfileForm onProfileCreated={fetchProfile} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;