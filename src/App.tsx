import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { ZingCredentialsPage } from './components/ZingCredentialsPage';
import { Dashboard } from './components/Dashboard';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ZingCredentials {
  companyCode: string;
  employeeCode: string;
  password: string;
  startDate: string;
  endDate: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'zing-credentials'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [zingCredentials, setZingCredentials] = useState<ZingCredentials | null>(null);

  const handleLogin = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setCurrentPage('dashboard');
  };

  const handleZingCredentials = (credentials: ZingCredentials) => {
    setZingCredentials(credentials);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setZingCredentials(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={user!}
          token={token}
          zingCredentials={zingCredentials}
          onLogout={handleLogout}
          onNavigateToZing={() => setCurrentPage('zing-credentials')}
        />
      )}
      {currentPage === 'zing-credentials' && (
        <ZingCredentialsPage 
          token={token} 
          onCredentialsSubmit={handleZingCredentials}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
}

export default App;