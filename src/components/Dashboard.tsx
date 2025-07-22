import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Calculator, Coffee, AlertCircle, BarChart3, X, Info, CheckCircle, Target, TrendingUp, Award, Zap, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 mb-6">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">TimeTracker Pro</h1>
                  <p className="text-blue-200 text-lg">Welcome back, {user.name}! ✨</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Time Format Selection */}
                <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-2 border border-white/30">
                  <button
                    onClick={() => handleTimeFormatChange('24')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      timeFormat === '24'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    24 Hour
                  </button>
                  <button
                    onClick={() => handleTimeFormatChange('12')}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      timeFormat === '12'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    12 Hour
                  </button>
                </div>
                
                <button
                  onClick={() => setShowInstructions(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Info className="w-5 h-5" />
                  Help
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-2 inline-flex">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-4 px-8 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'daily'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-6 h-6" />
              Daily Calculator
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`py-4 px-8 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              Weekly Overview
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'daily' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Input */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Enter Work Times</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-white/90 mb-3">
                    Punch Times (separate with commas)
                  </label>
                  <textarea
                    value={timeEntries}
                    onChange={(e) => setTimeEntries(e.target.value)}
                    placeholder={timeFormat === '12' ? 'Example: 09:00 AM, 12:30 PM, 01:30 PM, 06:00 PM' : 'Example: 09:00, 12:30, 13:30, 18:00'}
                    className="w-full h-32 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 resize-none text-white placeholder-white/60 text-lg"
                  />
                </div>
                
                {error && (
                  <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                    <p className="text-red-200 font-medium">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={handleCalculate}
                    disabled={!timeEntries.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Calculator className="w-6 h-6" />
                    Calculate Hours
                  </button>
                  <button
                    onClick={handleExampleInput}
                    className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Results */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              {results ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Today's Results</h3>
                    </div>
                    <span className="text-5xl">{results.emoji}</span>
                  </div>
                  
                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-2xl border border-green-400/50 shadow-lg">
                      <div className="text-4xl font-bold text-white mb-2">
                        {results.totalWorkingTime}
                      </div>
                      <div className="text-green-200 font-bold">Working Hours</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-2xl border border-blue-400/50 shadow-lg">
                      <div className="text-4xl font-bold text-white mb-2">
                        {results.totalOfficeTime}
                      </div>
                      <div className="text-blue-200 font-bold">Office Time</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-white font-bold mb-3">
                      <span>Progress to 8:30 target</span>
                      <span>{Math.min(Math.round(((results.totalWorkingHours * 60 + results.totalWorkingMinutes) / (8.5 * 60)) * 100), 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4 shadow-inner backdrop-blur-sm">
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${
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
                    <div className="flex items-center justify-center gap-3 text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl py-4 shadow-lg animate-pulse">
                      <Award className="w-8 h-8" />
                      <span className="font-bold text-xl">Daily Goal Achieved! 🎉</span>
                    </div>
                  )}

                  {/* Detailed Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-2xl border border-purple-400/50 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Coffee className="w-6 h-6 text-purple-200" />
                        <span className="font-bold text-white text-lg">Break Time</span>
                      </div>
                      <span className="font-bold text-white text-xl">{results.totalBreakTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-sm rounded-2xl border border-red-400/50 shadow-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-200" />
                        <span className="font-bold text-white text-lg">Missed Hours</span>
                      </div>
                      <span className="font-bold text-white text-xl">{results.missedHours}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-400/30 to-gray-500/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <Calculator className="w-12 h-12 text-white/60" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Calculate?</h3>
                  <p className="text-white/80 text-xl">
                    Enter your work times to see your daily breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Input */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Weekly Time Entry</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {days.map((day, index) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-16 text-lg font-bold text-white/90">{day}</div>
                      <input
                        type="text"
                        value={weeklyEntries[index]}
                        onChange={(e) => updateWeeklyEntry(index, e.target.value)}
                        placeholder={timeFormat === '12' ? '09:00 AM, 12:30 PM...' : '09:00, 12:30...'}
                        className="flex-1 p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-300 text-white placeholder-white/60"
                      />
                    </div>
                  ))}
                </div>
                
                {error && (
                  <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-300 mt-1 flex-shrink-0" />
                    <p className="text-red-200 font-medium">{error}</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={handleWeeklyCalculate}
                    className="flex-1 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <BarChart3 className="w-6 h-6" />
                    Calculate Week
                  </button>
                  <button
                    onClick={handleWeeklyExampleInput}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Example
                  </button>
                  <button
                    onClick={clearInputs}
                    className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Results */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              {weeklyResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Weekly Summary</h3>
                    </div>
                    <span className="text-5xl">{weeklyResults.overallEmoji}</span>
                  </div>
                  
                  {/* Weekly Stats */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 backdrop-blur-sm rounded-2xl border border-blue-400/50 shadow-lg">
                      <div className="text-3xl font-bold text-white mb-2">
                        {weeklyResults.averageWorkingTime}
                      </div>
                      <div className="text-blue-200 font-bold">Average Daily</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-2xl border border-green-400/50 shadow-lg">
                      <div className="text-3xl font-bold text-white mb-2">
                        {weeklyResults.totalWeeklyHours}
                      </div>
                      <div className="text-green-200 font-bold">Total Weekly</div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="max-h-64 overflow-y-auto">
                    <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Daily Breakdown
                    </h4>
                    <div className="space-y-3">
                      {weeklyResults.dailyResults.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{day.emoji}</span>
                            <span className="font-bold text-white w-16">{days[index]}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-300 text-lg">{day.workingTime}</div>
                            {day.missedHours > 0 || day.missedMinutes > 0 ? (
                              <div className="text-sm text-red-300 font-medium">-{day.missedTime}</div>
                            ) : (
                              <div className="text-sm text-green-300 font-medium">✓ Goal met!</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-400/30 to-gray-500/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                    <BarChart3 className="w-12 h-12 text-white/60" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Weekly Analysis Ready</h3>
                  <p className="text-white/80 text-xl">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  How to Copy Work Times from Zing
                </h3>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-2xl hover:bg-gray-100"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border-2 border-blue-200 shadow-lg">
                  <h4 className="font-bold text-blue-900 mb-6 flex items-center gap-3 text-xl">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-4 py-2 rounded-full font-bold">24H</span>
                    For 24 Hour Format
                  </h4>
                  <ol className="text-blue-800 space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">1</span>
                      <span className="font-medium text-lg">Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">2</span>
                      <span className="font-medium text-lg">Click the <strong>Cube icon</strong> in the upper left corner</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">3</span>
                      <span className="font-medium text-lg">Go to <strong>Time Cards</strong></span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">4</span>
                      <span className="font-medium text-lg">Copy the swipes and paste here</span>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border-2 border-green-200 shadow-lg">
                  <h4 className="font-bold text-green-900 mb-6 flex items-center gap-3 text-xl">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-2 rounded-full font-bold">12H</span>
                    For 12 Hour Format
                  </h4>
                  <ol className="text-green-800 space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="bg-green-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">1</span>
                      <span className="font-medium text-lg">Login to Zing</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-green-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">2</span>
                      <span className="font-medium text-lg">Go to <strong>Calendar</strong></span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-green-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">3</span>
                      <span className="font-medium text-lg">Click <strong>View More</strong></span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-green-500 text-white text-sm px-3 py-2 rounded-full font-bold mt-1">4</span>
                      <span className="font-medium text-lg">Find <strong>Raw Swipes</strong>, copy and paste here</span>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-8 p-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-3xl shadow-lg">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-yellow-800 mb-3 text-xl">Important Notes:</p>
                    <ul className="text-yellow-700 space-y-2 text-lg">
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