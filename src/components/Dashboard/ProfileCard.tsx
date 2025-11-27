import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, Train } from 'lucide-react';
import { EmployeeProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

interface ProfileCardProps {
  profile: EmployeeProfile;
  onEditClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditClick }) => {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={profile.full_name}
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            <p className="text-blue-200">{profile.designation}</p>
            <p className="text-blue-300 text-sm">ID: {profile.employee_id}</p>
          </div>
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email ?? '—'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{profile.phone_number}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Cadre</p>
                <p className="font-medium">{profile.cadre}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{profile.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Train className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Railway Division</p>
                <p className="font-medium">{profile.division}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{format(new Date(profile.date_of_birth), 'PPP')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-medium">{format(new Date(profile.date_of_joining), 'PPP')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium leading-relaxed">{profile.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;