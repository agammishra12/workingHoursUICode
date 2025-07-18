import React, { useState } from 'react';
import { Clock, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

interface ManualCalculationProps {
  token: string;
}

interface CalculationResult {
  status: string;
  message?: string;
  swipeDetails: string;
  totalWorkingHours: string;
  breakTime: string;
  needToCover: string;
  totalOfficeTime: string;
  firstIn?: string;
  lastOut?: string;
}

export const ManualCalculation: React.FC<ManualCalculationProps> = ({ token }) => {
  const [swipeDetails, setSwipeDetails] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiRequest(API_ENDPOINTS.CALCULATE_MANUAL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ swipeDetails }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Calculation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setSwipeDetails('09:15, 12:30, 13:30, 17:00, 17:15, 18:30');
  };

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="text-center">
        <img 
          src="https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=1200" 
          alt="Manual calculation"
          className="rounded-xl shadow-lg mx-auto w-full max-w-3xl h-48 object-cover mb-6"
        />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Manual Time Calculation</h3>
        <p className="text-gray-600">Enter swipe details to calculate working hours, breaks, and coverage needed</p>
      </div>

      {/* Input Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8">
        <form onSubmit={handleCalculate} className="space-y-6">
          <div>
            <label htmlFor="swipeDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Swipe Details (comma-separated times)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="swipeDetails"
                required
                value={swipeDetails}
                onChange={(e) => setSwipeDetails(e.target.value)}
                rows={3}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="e.g., 09:15, 12:30, 13:30, 17:00, 17:15, 18:30"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter times in HH:MM format, separated by commas. Each pair represents in/out times.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleExample}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Use Example
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Calculation Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            {result.status === 'success' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-500" />
            )}
            <h3 className="text-xl font-bold text-gray-900">Calculation Results</h3>
          </div>

          {result.status === 'error' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">{result.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Total Working Hours</h4>
                <p className="text-2xl font-bold text-blue-700">{result.totalWorkingHours}</p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                <h4 className="font-medium text-teal-900 mb-2">Break Time</h4>
                <p className="text-2xl font-bold text-teal-700">{result.breakTime}</p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">Need to Cover</h4>
                <p className="text-2xl font-bold text-orange-700">{result.needToCover}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Total Office Time</h4>
                <p className="text-2xl font-bold text-purple-700">{result.totalOfficeTime}</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">First In</h4>
                <p className="text-2xl font-bold text-green-700">{result.firstIn || 'N/A'}</p>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Last Out</h4>
                <p className="text-2xl font-bold text-red-700">{result.lastOut || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Swipe Details</h4>
            <p className="text-gray-700 font-mono">{result.swipeDetails}</p>
          </div>
        </div>
      )}
    </div>
  );
};