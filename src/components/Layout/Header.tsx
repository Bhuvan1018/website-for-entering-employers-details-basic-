import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    '/indian-railways-logo.svg'
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="Indian Railways logo"
                className="h-10 w-10 rounded-full bg-white p-1 object-contain"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={() => {
                  if (logoSrc !== 'https://upload.wikimedia.org/wikipedia/commons/1/14/Indian_Railways_Tricolour_Logo.svg') {
                    setLogoSrc('https://upload.wikimedia.org/wikipedia/commons/1/14/Indian_Railways_Tricolour_Logo.svg');
                  } else {
                    setLogoError(true);
                  }
                }}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white text-blue-800 flex items-center justify-center font-bold">
                IR
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">Indian Railways</h1>
              <p className="text-xs text-blue-200">Employee Management System</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm bg-blue-700 hover:bg-blue-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;