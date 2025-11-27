import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import AuthForm from '../Auth/AuthForm';
import Dashboard from '../Dashboard/Dashboard';

const AppRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Header />}
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" replace /> : <AuthForm />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/auth"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;