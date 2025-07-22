import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Lock, LogIn, Shield, Zap, BarChart3, CheckCircle, Star, Award, Target, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user data in localStorage (simple demo)
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      email: email,
      name: email.split('@')[0]
    }));
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      <div className="relative max-w-7xl w-full flex items-center justify-center gap-16">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex flex-col items-start max-w-2xl">
          <div className="mb-8">
            <img 
              src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop" 
              alt="Time management and productivity" 
              className="w-full h-80 object-cover rounded-3xl shadow-2xl mb-8 border-4 border-white/20"
            />
          </div>
          <h2 className="text-6xl font-bold text-white mb-8 leading-tight">
            Track Your Time,<br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Boost Productivity
            </span>
          </h2>
          <p className="text-2xl text-white/90 mb-10 leading-relaxed">
            Effortlessly monitor your working hours, breaks, and productivity with our intelligent time tracking system designed for modern professionals.
          </p>
          
          {/* Features */}
          <div className="space-y-8 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-2xl mb-2">Accurate Time Tracking</h3>
                <p className="text-white/80 text-lg">Precise calculation of working hours and breaks with smart analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl flex items-center justify-center shadow-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-2xl mb-2">Detailed Analytics</h3>
                <p className="text-white/80 text-lg">Comprehensive breakdown of your work patterns and productivity trends</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center shadow-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-2xl mb-2">Instant Results</h3>
                <p className="text-white/80 text-lg">Real-time calculations and insights with beautiful visualizations</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl flex items-center justify-center shadow-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-2xl mb-2">Goal Tracking</h3>
                <p className="text-white/80 text-lg">Set and achieve your daily work hour targets with progress tracking</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 w-full">
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
              <div className="text-3xl font-bold text-white mb-2">99%</div>
              <div className="text-white/80 font-medium">Accuracy</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 font-medium">Available</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
              <div className="text-3xl font-bold text-white mb-2">5K+</div>
              <div className="text-white/80 font-medium">Users</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
              <div className="text-3xl font-bold text-white mb-2">⭐⭐⭐⭐⭐</div>
              <div className="text-white/80 font-medium">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/50 w-full max-w-lg">
          {/* Logo and Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-8 shadow-xl">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              TimeTracker Pro
            </h1>
            <p className="text-gray-600 text-xl">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-4">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-xl bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-gray-700 mb-4">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-xl bg-gray-50/50 hover:bg-gray-50"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-5 px-8 rounded-2xl font-bold text-xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-7 h-7" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-10 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-200 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-blue-700 text-xl">Demo Access</span>
            </div>
            <p className="text-blue-600 text-center font-medium text-lg">
              Use any email and password to access the demo
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="font-medium">Trusted</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-purple-500" />
              <span className="font-medium">Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}