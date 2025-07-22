import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Calculator, Coffee, TrendingUp, AlertCircle, User, Calendar, Target, Award, BarChart3, X, Info, Copy, Plus, Minus, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TimeTracker</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'daily'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                Daily Hours
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'weekly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Weekly Overview
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'daily' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Input Section */}
            <div className="space-y-6">
              {/* Time Format Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Time Format</h3>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                  >
                    <Info className="w-4 h-4" />
                    Help
                  </button>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleTimeFormatChange('24')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '24'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    24 Hour (09:00)
                  </button>
                  <button
                    onClick={() => handleTimeFormatChange('12')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '12'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    12 Hour (09:00 AM)
                  </button>
                </div>
              </div>

              {/* Time Entry */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Enter Your Work Times
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Punch Times (separate with commas)
                    </label>
                    <div className="relative">
                      <textarea
                        value={timeEntries}
                        onChange={(e) => setTimeEntries(e.target.value)}
                        placeholder={timeFormat === '12' ? 'Example: 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'Example: 09:00, 12:30, 13:30, 18:00'}
                        className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                      />
                      {timeEntries && (
                        <button
                          onClick={clearDailyInput}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded"
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
                      disabled={!timeEntries.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculate Hours
                    </button>
                    <button
                      onClick={handleExampleInput}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                    >
                      Example
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Quick Tips
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Enter times in {timeFormat === '12' ? 'HH:MM AM/PM' : 'HH:MM'} format</li>
                    <li>• Times should be in pairs (punch in, punch out)</li>
                    <li>• Target: 8 hours 30 minutes per day</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Results Section */}
            <div>
              {results ? (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
                      <span className="text-3xl">{results.emoji}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {results.totalWorkingTime}
                        </div>
                        <div className="text-sm text-green-700 font-medium">Working Hours</div>
                        <div className="text-xs text-green-600 mt-1">
                          {results.totalWorkingHours}h {results.totalWorkingMinutes}m
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {results.totalOfficeTime}
                        </div>
                        <div className="text-sm text-blue-700 font-medium">Office Time</div>
                        <div className="text-xs text-blue-600 mt-1">
                          {results.totalOfficeHours}h {results.totalOfficeMinutes}m
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress to 8:30 target</span>
                        <span>{Math.min(Math.round(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100), 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
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
                      <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg py-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Daily Goal Achieved! 🎉</span>
                      </div>
                    )}
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Coffee className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Break Time</span>
                        </div>
                        <span className="font-semibold text-purple-600">{results.totalBreakTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-gray-900">Missed Hours</span>
                        </div>
                        <span className="font-semibold text-red-600">{results.missedHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Calculate?</h3>
                  <p className="text-gray-600">
                    Enter your work times and see your daily breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Input Section */}
            <div className="space-y-6">
              {/* Time Format Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Time Format</h3>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                  >
                    <Info className="w-4 h-4" />
                    Help
                  </button>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleTimeFormatChange('24')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '24'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    24 Hour
                  </button>
                  <button
                    onClick={() => handleTimeFormatChange('12')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      timeFormat === '12'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    12 Hour
                  </button>
                </div>
              </div>

              {/* Weekly Entry */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Weekly Time Entry
                </h3>
                
                <div className="space-y-3">
                  {days.map((day, index) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {day}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={weeklyEntries[index]}
                          onChange={(e) => updateWeeklyEntry(index, e.target.value)}
                          placeholder={timeFormat === '12' ? '09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : '09:00, 12:30, 13:30, 18:00'}
                          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
                
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleWeeklyCalculate}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Calculate Week
                  </button>
                  <button
                    onClick={handleWeeklyExampleInput}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearWeeklyInput}
                    className="px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Results Section */}
            <div>
              {weeklyResults ? (
                <div className="space-y-4">
                  {/* Weekly Summary */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Weekly Summary</h3>
                      <span className="text-3xl">{weeklyResults.overallEmoji}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {weeklyResults.averageWorkingTime}
                        </div>
                        <div className="text-sm text-blue-700 font-medium">Average Daily Hours</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {weeklyResults.totalWeeklyHours}
                        </div>
                        <div className="text-sm text-green-700 font-medium">Total Weekly Hours</div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Breakdown</h3>
                    <div className="space-y-3">
                      {weeklyResults.dailyResults.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{day.emoji}</span>
                            <span className="font-medium text-gray-900">{day.day}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{day.workingTime}</div>
                            {day.missedHours > 0 || day.missedMinutes > 0 ? (
                              <div className="text-xs text-red-600">-{day.missedTime}</div>
                            ) : (
                              <div className="text-xs text-green-600">Goal met!</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Weekly Analysis?</h3>
                  <p className="text-gray-600">
                    Fill in your work times for each day to get weekly insights
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions Panel */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Copy className="w-5 h-5 text-blue-600" />
                    How to Copy Work Times from Zing
                  </h3>
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
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
                        Copy the swipes and paste here
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
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Important:</p>
                      <p className="text-sm text-yellow-700">Times must be in pairs (in/out). If you have uneven swipes, you'll see a warning message.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}