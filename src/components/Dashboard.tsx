import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Calculator, Coffee, AlertCircle, BarChart3, X, Info, Target, TrendingUp, Award, Zap, Timer, CheckCircle2 } from 'lucide-react';
import { calculateWorkingHours, calculateWeeklyHours, WeeklyResults } from '../utils/workingHoursCalculator';
import { calculateLiveHours, LiveTrackingData } from '../utils/liveTracker';
import { WorkingHoursData } from '../types';

// Helper function to format time according to selected format
const formatTimeDisplay = (time24: string, format: '12' | '24'): string => {
  if (format === '24' || !time24 || time24 === 'Already completed!') {
    return time24;
  }
  
  const [hours, minutes] = time24.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return time24;
  }
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'live'>('daily');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24');
  const [timeEntries, setTimeEntries] = useState('');
  const [weeklyEntries, setWeeklyEntries] = useState<string[]>(Array(7).fill(''));
  const [liveEntries, setLiveEntries] = useState('');
  const [results, setResults] = useState<WorkingHoursData | null>(null);
  const [weeklyResults, setWeeklyResults] = useState<WeeklyResults | null>(null);
  const [liveResults, setLiveResults] = useState<LiveTrackingData | null>(null);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const handleLiveCalculate = () => {
    try {
      setError('');
      const data = calculateLiveHours(liveEntries);
      setLiveResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLiveResults(null);
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

  const handleLiveExampleInput = () => {
    if (timeFormat === '12') {
      setLiveEntries('09:00 AM, 12:30 PM, 01:30 PM');
    } else {
      setLiveEntries('09:00, 12:30, 13:30');
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
    setTimeEntries('');
    setLiveEntries('');
    setWeeklyEntries(Array(7).fill(''));
    setResults(null);
    setLiveResults(null);
    setWeeklyResults(null);
    setError('');
  };

  const clearInputs = () => {
    setTimeEntries('');
    setLiveEntries('');
    setWeeklyEntries(Array(7).fill(''));
    setResults(null);
    setLiveResults(null);
    setWeeklyResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TimeTracker Pro</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Time Format Selection */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Time Format:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleTimeFormatChange('24')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '24'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    24 Hour
                  </button>
                  <button
                    onClick={() => handleTimeFormatChange('12')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '12'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    12 Hour
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                Help
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-1 inline-flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'daily'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
              Daily Calculator
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Zap className="w-5 h-5" />
              Live Tracker
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'weekly'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Weekly Overview
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'daily' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Input */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Enter Work Times</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Punch Times (separate with commas)
                  </label>
                  <textarea
                    value={timeEntries}
                    onChange={(e) => setTimeEntries(e.target.value)}
                    placeholder={timeFormat === '12' ? 'Example: 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'Example: 09:00, 12:30, 13:30, 18:00'}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleCalculate}
                    disabled={!timeEntries.trim()}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Hours
                  </button>
                  <button
                    onClick={handleExampleInput}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Results */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {results ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Today's Results</h3>
                    </div>
                    <span className="text-4xl">{results.emoji}</span>
                  </div>
                  
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {results.totalWorkingTime}
                      </div>
                      <div className="text-green-600 font-medium">Working Hours</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700 mb-1">
                        {results.totalOfficeTime}
                      </div>
                      <div className="text-blue-600 font-medium">Office Time</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-gray-700 font-medium mb-2">
                      <span>Progress to 8:30 target</span>
                      <span>{Math.min(Math.round(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100), 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 510) ? 'bg-green-500' :
                          ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 480) ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  {results.totalWorkingHours >= 8 && results.totalWorkingMinutes >= 30 && (
                    <div className="flex items-center justify-center gap-3 text-white bg-green-600 rounded-lg py-3">
                      <Award className="w-6 h-6" />
                      <span className="font-semibold">Daily Goal Achieved! 🎉</span>
                    </div>
                  )}

                  {/* Detailed Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-700">Break Time</span>
                      </div>
                      <span className="font-semibold text-purple-700">{results.totalBreakTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-700">Missed Hours</span>
                      </div>
                      <span className="font-semibold text-red-700">{results.missedHours}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Calculate</h3>
                  <p className="text-gray-600">
                    Enter your work times to see your daily breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'live' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Input */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Live Time Tracker</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-700">How it works</span>
                  </div>
                  <p className="text-orange-600 text-sm">
                    Enter your incomplete swipe data (odd number of entries). The system will use the current time to calculate your progress and predict when you'll complete 8:30 hours.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Swipe Times (incomplete data)
                  </label>
                  <textarea
                    value={liveEntries}
                    onChange={(e) => setLiveEntries(e.target.value)}
                    placeholder={timeFormat === '12' ? 'Example: 09:00 AM, 12:30 PM, 01:30 PM' : 'Example: 09:00, 12:30, 13:30'}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleLiveCalculate}
                    disabled={!liveEntries.trim()}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Track Live
                  </button>
                  <button
                    onClick={handleLiveExampleInput}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Live Results */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {liveResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Timer className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Live Progress</h3>
                    </div>
                    <span className="text-4xl">{liveResults.emoji}</span>
                  </div>
                  
                  {/* Current Time Display */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-700 mb-1">
                      Current Time: {formatTimeDisplay(liveResults.currentTime, timeFormat)}
                    </div>
                    <div className="text-blue-600 font-medium">
                      {liveResults.isCurrentlyWorking ? '🟢 Currently Working' : '🔴 On Break'}
                    </div>
                  </div>
                  
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {liveResults.currentWorkingTime}
                      </div>
                      <div className="text-green-600 font-medium">Hours So Far</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700 mb-1">
                        {liveResults.remainingTime}
                      </div>
                      <div className="text-purple-600 font-medium">Time Remaining</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-gray-700 font-medium mb-2">
                      <span>Progress to 8:30 target</span>
                      <span>{liveResults.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          liveResults.progressPercentage >= 100 ? 'bg-green-500' :
                          liveResults.progressPercentage >= 90 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(liveResults.progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Completion Time Prediction */}
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-indigo-700">Target Completion</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-700 mb-1">
                      {formatTimeDisplay(liveResults.completionTime, timeFormat)}
                    </div>
                    <div className="text-indigo-600 text-sm">
                      {liveResults.isCurrentlyWorking 
                        ? 'If you continue working without breaks' 
                        : 'When you resume working (excluding current break time)'}
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  {liveResults.progressPercentage >= 100 && (
                    <div className="flex items-center justify-center gap-3 text-white bg-green-600 rounded-lg py-3">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold">Target Already Achieved! 🎉</span>
                    </div>
                  )}

                  {/* Additional Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-700">Office Time</span>
                      </div>
                      <span className="font-semibold text-blue-700">{liveResults.totalOfficeTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-700">Break Time</span>
                      </div>
                      <span className="font-semibold text-yellow-700">{liveResults.totalBreakTime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track Live</h3>
                  <p className="text-gray-600">
                    Enter your incomplete swipe data to see real-time progress
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Input */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Weekly Time Entry</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-gray-700">{dayAbbr[index]}</div>
                      <input
                        type="text"
                        value={weeklyEntries[index]}
                        onChange={(e) => updateWeeklyEntry(index, e.target.value)}
                        placeholder={timeFormat === '12' ? '09:00 AM, 12:30 PM...' : '09:00, 12:30...'}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={handleWeeklyCalculate}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Calculate Week
                  </button>
                  <button
                    onClick={handleWeeklyExampleInput}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Results */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {weeklyResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Weekly Summary</h3>
                    </div>
                    <span className="text-4xl">{weeklyResults.overallEmoji}</span>
                  </div>
                  
                  {/* Weekly Stats */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700 mb-1">
                        {weeklyResults.averageWorkingTime}
                      </div>
                      <div className="text-blue-600 font-medium">Average Daily</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-1">
                        {weeklyResults.totalWeeklyHours}
                      </div>
                      <div className="text-green-600 font-medium">Total Weekly</div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-900 mb-4">Daily Breakdown</h4>
                    <div className="space-y-3">
                      {weeklyResults.dailyResults.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{day.emoji}</span>
                            <span className="font-medium text-gray-700 w-16">{dayAbbr[index]}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{day.workingTime}</div>
                            {day.missedHours > 0 || day.missedMinutes > 0 ? (
                              <div className="text-sm text-red-600">-{day.missedTime}</div>
                            ) : (
                              <div className="text-sm text-green-600">✓ Goal met!</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Weekly Analysis Ready</h3>
                  <p className="text-gray-600">
                    Fill in your work times to get weekly insights
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  How to Copy Work Times from Zing
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">24H</span>
                    For 24 Hour Format
                  </h4>
                  <ol className="text-blue-800 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">1</span>
                      <span>Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">2</span>
                      <span>Click the <strong>Cube icon</strong> in the upper left corner</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">3</span>
                      <span>Go to <strong>Time Cards</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">4</span>
                      <span>Copy the swipes and paste here</span>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">12H</span>
                    For 12 Hour Format
                  </h4>
                  <ol className="text-green-800 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">1</span>
                      <span>Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">2</span>
                      <span>Go to <strong>Calendar</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">3</span>
                      <span>Click <strong>View More</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold mt-0.5">4</span>
                      <span>Find <strong>Raw Swipes</strong>, copy and paste here</span>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-800 mb-2">Live Tracker Feature:</p>
                    <ul className="text-orange-700 space-y-1">
                      <li>• Use when you have incomplete swipe data (odd number of entries)</li>
                      <li>• System uses current time to calculate progress</li>
                      <li>• Shows when you'll complete your 8:30 target</li>
                      <li>• Perfect for real-time tracking during work hours</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-2">Important Notes:</p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Times must be in pairs (in/out)</li>
                      <li>• Target: 8 hours 30 minutes per day</li>
                      <li>• Uneven swipes will show a warning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}