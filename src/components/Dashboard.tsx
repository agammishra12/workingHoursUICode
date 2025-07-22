import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Calculator, Coffee, AlertCircle, BarChart3, X, Info, CheckCircle, Target, TrendingUp, Award } from 'lucide-react';
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
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    setTimeEntries('');
    setWeeklyEntries(Array(7).fill(''));
    setResults(null);
    setWeeklyResults(null);
    setError('');
  };

  const clearInputs = () => {
    setTimeEntries('');
    setWeeklyEntries(Array(7).fill(''));
    setResults(null);
    setWeeklyResults(null);
    setError('');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TimeTracker Pro</h1>
                <p className="text-blue-100">Welcome back, {user.name}!</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Time Format Selection */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
                <button
                  onClick={() => handleTimeFormatChange('24')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    timeFormat === '24'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  24 Hour
                </button>
                <button
                  onClick={() => handleTimeFormatChange('12')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    timeFormat === '12'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  12 Hour
                </button>
              </div>
              
              <button
                onClick={() => setShowInstructions(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 rounded-xl font-medium"
              >
                <Info className="w-4 h-4" />
                Help
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600 transition-all duration-200 rounded-xl font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="px-6 py-4 flex-shrink-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-2 inline-flex">
          <button
            onClick={() => setActiveTab('daily')}
            className={`py-3 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Clock className="w-5 h-5" />
            Daily Hours
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`py-3 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Weekly Overview
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6 pb-6 min-h-0">
        {activeTab === 'daily' ? (
          <div className="h-full grid grid-cols-2 gap-6">
            {/* Daily Input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Enter Work Times</h3>
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Punch Times (separate with commas)
                </label>
                <textarea
                  value={timeEntries}
                  onChange={(e) => setTimeEntries(e.target.value)}
                  placeholder={timeFormat === '12' ? 'Example: 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'Example: 09:00, 12:30, 13:30, 18:00'}
                  className="flex-1 p-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-sm bg-blue-50/50"
                />
                
                {error && (
                  <div className="mt-4 p-4 bg-red-100 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCalculate}
                    disabled={!timeEntries.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Hours
                  </button>
                  <button
                    onClick={handleExampleInput}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Results */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col">
              {results ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Today's Results</h3>
                    </div>
                    <span className="text-4xl">{results.emoji}</span>
                  </div>
                  
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-200">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {results.totalWorkingTime}
                      </div>
                      <div className="text-sm text-green-700 font-semibold">Working Hours</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {results.totalOfficeTime}
                      </div>
                      <div className="text-sm text-blue-700 font-semibold">Office Time</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                      <span>Progress to 8:30 target</span>
                      <span>{Math.min(Math.round(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100), 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 510) ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          ((results.totalWorkingHours * 60 + results.totalWorkingMinutes) >= 480) ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-pink-500'
                        } shadow-lg`}
                        style={{ width: `${Math.min(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  {results.totalWorkingHours >= 8 && results.totalWorkingMinutes >= 30 && (
                    <div className="mb-6 flex items-center justify-center gap-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl py-3 shadow-lg">
                      <Award className="w-6 h-6" />
                      <span className="font-bold text-lg">Daily Goal Achieved! 🎉</span>
                    </div>
                  )}

                  {/* Detailed Stats */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
                      <div className="flex items-center gap-3">
                        <Coffee className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">Break Time</span>
                      </div>
                      <span className="font-bold text-purple-600 text-lg">{results.totalBreakTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl border-2 border-red-200">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Missed Hours</span>
                      </div>
                      <span className="font-bold text-red-600 text-lg">{results.missedHours}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6">
                    <Calculator className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">Ready to Calculate?</h3>
                  <p className="text-gray-600 text-lg">
                    Enter your work times to see your daily breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full grid grid-cols-2 gap-6">
            {/* Weekly Input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Weekly Time Entry</h3>
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-semibold text-gray-600">{day}</div>
                      <input
                        type="text"
                        value={weeklyEntries[index]}
                        onChange={(e) => updateWeeklyEntry(index, e.target.value)}
                        placeholder={timeFormat === '12' ? '09:00 AM, 12:30 PM...' : '09:00, 12:30...'}
                        className="flex-1 p-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-sm bg-green-50/50"
                      />
                    </div>
                  ))}
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-100 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleWeeklyCalculate}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Calculate Week
                  </button>
                  <button
                    onClick={handleWeeklyExampleInput}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Results */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col">
              {weeklyResults ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Weekly Summary</h3>
                    </div>
                    <span className="text-4xl">{weeklyResults.overallEmoji}</span>
                  </div>
                  
                  {/* Weekly Stats */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {weeklyResults.averageWorkingTime}
                      </div>
                      <div className="text-sm text-blue-700 font-semibold">Average Daily</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {weeklyResults.totalWeeklyHours}
                      </div>
                      <div className="text-sm text-green-700 font-semibold">Total Weekly</div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="flex-1 overflow-y-auto">
                    <h4 className="font-bold text-gray-700 mb-3">Daily Breakdown</h4>
                    <div className="space-y-2">
                      {weeklyResults.dailyResults.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{day.emoji}</span>
                            <span className="font-semibold text-gray-800 w-12">{days[index]}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{day.workingTime}</div>
                            {day.missedHours > 0 || day.missedMinutes > 0 ? (
                              <div className="text-xs text-red-600 font-medium">-{day.missedTime}</div>
                            ) : (
                              <div className="text-xs text-green-600 font-medium">✓ Goal met!</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">Weekly Analysis Ready</h3>
                  <p className="text-gray-600 text-lg">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  How to Copy Work Times from Zing
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-3 py-1 rounded-full font-bold">24H</span>
                    For 24 Hour Format
                  </h4>
                  <ol className="text-blue-800 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">1</span>
                      <span className="font-medium">Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">2</span>
                      <span className="font-medium">Click the <strong>Cube icon</strong> in the upper left corner</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">3</span>
                      <span className="font-medium">Go to <strong>Time Cards</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">4</span>
                      <span className="font-medium">Copy the swipes and paste here</span>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-4 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 rounded-full font-bold">12H</span>
                    For 12 Hour Format
                  </h4>
                  <ol className="text-green-800 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">1</span>
                      <span className="font-medium">Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">2</span>
                      <span className="font-medium">Go to <strong>Calendar</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">3</span>
                      <span className="font-medium">Click <strong>View More</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full font-bold mt-0.5">4</span>
                      <span className="font-medium">Find <strong>Raw Swipes</strong>, copy and paste here</span>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-yellow-800 mb-2">Important Notes:</p>
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