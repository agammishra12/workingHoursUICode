import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Calculator, Coffee, TrendingUp, AlertCircle, User, Calendar, Target, Award, BarChart3, X, Info, Copy } from 'lucide-react';
import { calculateWorkingHours, calculateWeeklyHours, WeeklyResults } from '../utils/workingHoursCalculator';
import { WorkingHoursData } from '../types';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24');
  const [timeEntries, setTimeEntries] = useState('');
  const [weeklyEntries, setWeeklyEntries] = useState<string[]>(Array(7).fill(''));
  const [results, setResults] = useState<WorkingHoursData | null>(null);
  const [weeklyResults, setWeeklyResults] = useState<WeeklyResults | null>(null);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCalculate = () => {
    try {
      setError('');
      const data = calculateWorkingHours(timeEntries);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    }
  };

  const handleWeeklyCalculate = () => {
    try {
      setError('');
      const data = calculateWeeklyHours(weeklyEntries);
      setWeeklyResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeeklyResults(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleExampleInput = () => {
    if (timeFormat === '12') {
      setTimeEntries('09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM');
    } else {
      setTimeEntries('09:00, 12:30, 13:30, 18:00');
    }
  };

  const handleWeeklyExampleInput = () => {
    let examples;
    if (timeFormat === '12') {
      examples = [
        '09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM',
        '08:30 AM, 12:00 PM, 01:00 PM, 05:30 PM',
        '09:15 AM, 12:45 PM, 01:45 PM, 06:15 PM',
        '08:45 AM, 12:15 PM, 01:15 PM, 05:45 PM',
        '09:00 AM, 12:30 PM, 01:30 PM, 05:00 PM',
        '', // Saturday empty
        '', // Sunday empty
      ];
    } else {
      examples = [
        '09:00, 12:30, 13:30, 18:00',
        '08:30, 12:00, 13:00, 17:30',
        '09:15, 12:45, 13:45, 18:15',
        '08:45, 12:15, 13:15, 17:45',
        '09:00, 12:30, 13:30, 17:00',
        '', // Saturday empty
        '', // Sunday empty
      ];
    }
    setWeeklyEntries(examples);
  };

  const updateWeeklyEntry = (index: number, value: string) => {
    const newEntries = [...weeklyEntries];
    newEntries[index] = value;
    setWeeklyEntries(newEntries);
  };

  const handleTimeFormatChange = (format: '12' | '24') => {
    setTimeFormat(format);
    // Clear all inputs when format changes
    setTimeEntries('');
    setWeeklyEntries(Array(7).fill(''));
    setResults(null);
    setWeeklyResults(null);
    setError('');
  };

  const clearDailyInput = () => {
    setTimeEntries('');
    setResults(null);
    setError('');
  };

  const clearWeeklyInput = () => {
    setWeeklyEntries(Array(7).fill(''));
    setWeeklyResults(null);
    setError('');
  };

  const clearWeeklyDay = (index: number) => {
    const newEntries = [...weeklyEntries];
    newEntries[index] = '';
    setWeeklyEntries(newEntries);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Office background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TimeTracker</h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" 
                  alt="Productivity workspace" 
                  className="w-16 h-16 rounded-xl object-cover shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Track Your Productivity</h2>
                  <p className="text-gray-600">Monitor your daily and weekly working patterns with detailed insights</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Goal: 8:30h/day</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Track Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-2">
            {/* Time Format Toggle */}
            <div className="flex justify-between items-center mb-4 px-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Time Format:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleTimeFormatChange('24')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '24'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    24 Hour
                  </button>
                  <button
                    onClick={() => handleTimeFormatChange('12')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '12'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    12 Hour
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
                Copy from Zing
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'daily'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-5 h-5" />
                Track Daily Work Hours
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'weekly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Track Weekly Working Hours
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="mb-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Copy className="w-5 h-5 text-blue-600" />
                How to Copy Work Times from Zing
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">24H</span>
                  For 24 Hour Format
                </h4>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">1</span>
                    Login to Zing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">2</span>
                    Click the <strong>Cube icon</strong> in the upper left corner
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">3</span>
                    Go to <strong>Time Cards</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">4</span>
                    Copy the swipes for the whole month and paste here
                  </li>
                </ol>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">12H</span>
                  For 12 Hour Format
                </h4>
                <ol className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">1</span>
                    Login to Zing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">2</span>
                    Go to <strong>Calendar</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">3</span>
                    Click <strong>View More</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full mt-0.5">4</span>
                    Find <strong>Raw Swipes</strong>, copy and paste here
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Important:</p>
                  <p className="text-sm text-yellow-700">Swipes must be in pairs (in/out). If you have uneven swipes, you'll see a warning message.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'daily' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daily Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Daily Time Entry
                </h2>
                
                <div className="space-y-4">
                  {/* Visual Time Entry Helper */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                        alt="Time tracking" 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Quick Entry</h3>
                        <p className="text-sm text-gray-600">Enter your punch times below</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/70 rounded-lg p-2 text-center">
                        <div className="font-medium text-green-700">IN</div>
                        <div className="text-gray-600">09:00, 13:30</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2 text-center">
                        <div className="font-medium text-red-700">OUT</div>
                        <div className="text-gray-600">12:30, 18:00</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Times (comma-separated, {timeFormat === '12' ? 'HH:MM AM/PM' : 'HH:MM'} format)
                    </label>
                    <div className="relative">
                      <textarea
                        value={timeEntries}
                        onChange={(e) => setTimeEntries(e.target.value)}
                        placeholder={timeFormat === '12' ? 'e.g., 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'e.g., 09:00, 12:30, 13:30, 18:00'}
                        className="w-full h-32 p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
                      />
                      {timeEntries && (
                        <button
                          onClick={clearDailyInput}
                          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          title="Clear input"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleCalculate}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate
                    </button>
                    <button
                      onClick={handleExampleInput}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
                    >
                      Example
                    </button>
                    {timeEntries && (
                      <button
                        onClick={clearDailyInput}
                        className="px-4 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors duration-200 text-sm"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop" 
                      alt="Instructions" 
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <h3 className="font-medium text-blue-900">How to use:</h3>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter times in {timeFormat === '12' ? 'HH:MM AM/PM' : 'HH:MM'} format</li>
                    <li>• Separate multiple times with commas</li>
                    <li>• Times should be in pairs (in/out)</li>
                    <li>• Target: 8:30 hours per day</li>
                    <li>• Use "Copy from Zing" button for instructions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Results Section */}
            <div className="lg:col-span-2">
              {results ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Working Hours Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{results.emoji}</span>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <img 
                        src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" 
                        alt="Working hours visualization" 
                        className="w-full h-20 object-cover rounded-lg opacity-80"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-green-600">
                        {results.totalWorkingTime}
                      </div>
                      <p className="text-sm text-gray-600">
                        {results.totalWorkingHours} hours and {results.totalWorkingMinutes} minutes
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 510) ? 'bg-green-600' :
                            ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 480) ? 'bg-yellow-500' :
                            ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 420) ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Total Office Time Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Office Time</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{results.officeEmoji}</span>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <img 
                        src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" 
                        alt="Office time visualization" 
                        className="w-full h-20 object-cover rounded-lg opacity-80"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-blue-600">
                        {results.totalOfficeTime}
                      </div>
                      <p className="text-sm text-gray-600">
                        {results.totalOfficeHours} hours and {results.totalOfficeMinutes} minutes
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            ((results.totalOfficeHours * 60 + results.totalOfficeMinutes) >= 540) ? 'bg-green-600' :
                            ((results.totalOfficeHours * 60 + results.totalOfficeMinutes) >= 510) ? 'bg-yellow-500' :
                            ((results.totalOfficeHours * 60 + results.totalOfficeMinutes) >= 480) ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(((results.totalOfficeHours * 60 + results.totalOfficeMinutes) / (9 * 60)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {results.totalOfficeHours >= 9 && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2">
                          <span className="text-lg">👏</span>
                          Great dedication! 9+ hours in office
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Break Time Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Break Time</h3>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Coffee className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <img 
                        src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" 
                        alt="Break time visualization" 
                        className="w-full h-20 object-cover rounded-lg opacity-80"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-purple-600">
                        {results.totalBreakTime}
                      </div>
                      <p className="text-sm text-gray-600">
                        {results.totalBreakHours} hours and {results.totalBreakMinutes} minutes
                      </p>
                    </div>
                  </div>

                  {/* Missed Hours Card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Missed Hours</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{results.emoji}</span>
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <img 
                        src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&fit=crop" 
                        alt="Missed hours visualization" 
                        className="w-full h-20 object-cover rounded-lg opacity-80"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-red-600">
                        {results.missedHours}
                      </div>
                      <p className="text-sm text-gray-600">
                        {results.missedHoursNum} hours and {results.missedMinutesNum} minutes short of 8:30 hours
                      </p>
                      {results.missedHoursNum === 0 && results.missedMinutesNum === 0 && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <Award className="w-4 h-4" />
                          Goal achieved! 🎉
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                  <div className="mb-6">
                    <img 
                      src="https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                      alt="Get started with time tracking" 
                      className="w-48 h-32 object-cover rounded-xl mx-auto mb-4 opacity-80"
                    />
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track Your Daily Time?</h3>
                  <p className="text-gray-600">
                    Enter your work times and click "Calculate" to see your working hours breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Input Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Weekly Time Entry
                </h2>
                
                <div className="space-y-4">
                  {/* Weekly Entry Helper */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                        alt="Weekly tracking" 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Weekly Overview</h3>
                        <p className="text-sm text-gray-600">Track your entire week</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Daily Inputs */}
                  <div className="space-y-3">
                    {days.map((day, index) => (
                      <div key={day}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {day} (optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={weeklyEntries[index]}
                            onChange={(e) => updateWeeklyEntry(index, e.target.value)}
                            placeholder={timeFormat === '12' ? 'e.g., 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'e.g., 09:00, 12:30, 13:30, 18:00'}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                          />
                          {weeklyEntries[index] && (
                            <button
                              onClick={() => clearWeeklyDay(index)}
                              className="absolute top-1/2 right-3 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              title="Clear this day"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleWeeklyCalculate}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Calculate Week
                    </button>
                    <button
                      onClick={handleWeeklyExampleInput}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
                    >
                      Example
                    </button>
                    <button
                      onClick={clearWeeklyInput}
                      className="px-4 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors duration-200 text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Weekly Instructions */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src="https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop" 
                      alt="Instructions" 
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <h3 className="font-medium text-green-900">Weekly Tracking:</h3>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Fill in any days you worked</li>
                    <li>• Leave empty days blank</li>
                    <li>• Use {timeFormat === '12' ? 'HH:MM AM/PM' : 'HH:MM'} format</li>
                    <li>• Get weekly averages and insights</li>
                    <li>• Use "Copy from Zing" for instructions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Weekly Results Section */}
            <div className="lg:col-span-2">
              {weeklyResults ? (
                <div className="space-y-6">
                  {/* Weekly Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Average Daily Hours</h3>
                        <span className="text-2xl">{weeklyResults.overallEmoji}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {weeklyResults.averageWorkingTime}
                      </div>
                    </div>
                    
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Total Weekly Hours</h3>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {weeklyResults.totalWeeklyHours}
                      </div>
                    </div>
                    
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Avg. Missed Daily</h3>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {weeklyResults.averageMissedTime}
                      </div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Daily Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {weeklyResults.dailyResults.map((day, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{day.day}</h4>
                            <span className="text-2xl">{day.emoji}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Worked:</span>
                              <span className="font-medium text-green-600">{day.workingTime}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Missed:</span>
                              <span className="font-medium text-red-600">{day.missedTime}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  ((day.workingHours * 60 + day.workingMinutes) >= 510) ? 'bg-green-600' :
                                  ((day.workingHours * 60 + day.workingMinutes) >= 480) ? 'bg-yellow-500' :
                                  ((day.workingHours * 60 + day.workingMinutes) >= 420) ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(((day.workingHours * 60 + day.workingMinutes) / (8.5 * 60)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                  <div className="mb-6">
                    <img 
                      src="https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                      alt="Get started with weekly tracking" 
                      className="w-48 h-32 object-cover rounded-xl mx-auto mb-4 opacity-80"
                    />
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track Your Weekly Time?</h3>
                  <p className="text-gray-600">
                    Fill in your work times for each day and get comprehensive weekly insights
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}