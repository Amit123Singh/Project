import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { FundsProvider } from './hooks/useFunds';
import Login from './pages/Login';
import FundSelection from './pages/FundSelection';
import Comparison from './pages/Comparison';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/funds" />;
};

function App() {
  return (
    <AuthProvider>
      <FundsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/funds" element={
              <ProtectedRoute>
                <FundSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/comparison" element={
              <ProtectedRoute>
                <Comparison />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/funds" />} />
          </Routes>
        </Router>
      </FundsProvider>
    </AuthProvider>
  );
}

export default App;