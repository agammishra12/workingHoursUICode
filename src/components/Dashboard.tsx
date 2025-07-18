import React, { useState } from 'react';
import { User, ZingCredentials } from '../App';
import { ManualCalculation } from './ManualCalculation';
import { AutoCalculation } from './AutoCalculation';
import { LogOut, Calculator, Zap, Settings } from 'lucide-react';

interface DashboardProps {
  user: User;
  token: string;
  zingCredentials: ZingCredentials | null;
  onLogout: () => void;
  onNavigateToZing: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, token, zingCredentials, onLogout, onNavigateToZing }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Working Hours Calculator</h1>
                <p className="text-gray-600">Welcome back, {user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateToZing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Zing Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Time Tracking Dashboard
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Calculate working hours manually or automatically sync with Zing HR
          </p>
          {!zingCredentials && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-800">
                <strong>Setup Required:</strong> Configure your Zing credentials to use automatic calculation features.
                <button
                  onClick={onNavigateToZing}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Configure Now
                </button>
              </p>
            </div>
          )}
          <img 
            src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Professional dashboard"
            className="rounded-xl shadow-2xl mx-auto w-full max-w-4xl h-64 object-cover"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-1 mb-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'manual'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calculator className="h-5 w-5" />
              <span>Manual Calculation</span>
            </button>
            <button
              onClick={() => setActiveTab('auto')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'auto'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Zap className="h-5 w-5" />
              <span>Auto Calculation</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-16">
          {activeTab === 'manual' && <ManualCalculation token={token} />}
          {activeTab === 'auto' && <AutoCalculation token={token} zingCredentials={zingCredentials} onNavigateToZing={onNavigateToZing} />}
        </div>
      </div>
    </div>
  );
};