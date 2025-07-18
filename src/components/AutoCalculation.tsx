import React, { useState } from 'react';
import { ZingCredentials } from '../App';
import { Zap, Download, Users, Calendar, AlertCircle, Settings } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

interface AutoCalculationProps {
  token: string;
  zingCredentials: ZingCredentials | null;
  onNavigateToZing?: () => void;
}

interface EmployeeData {
  employeeCode: string;
  employeeName: string;
  email: string;
  date: string;
  firstIn: string;
  lastOut: string;
  officeHours: string;
  swipeDetails: string;
  totalWorkingHours: string;
  breakTime: string;
  needToCover: string;
  totalHours: string;
}

export const AutoCalculation: React.FC<AutoCalculationProps> = ({ token, zingCredentials, onNavigateToZing }) => {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutoCalculate = async () => {
    if (!zingCredentials) {
      setError('Zing credentials not configured. Please set up your credentials first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(API_ENDPOINTS.CALCULATE_AUTO, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(zingCredentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmployeeData(data.data);
      } else {
        setError(data.message || 'Auto calculation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (employeeData.length === 0) return;

    const headers = [
      'Employee Code', 'Employee Name', 'Email', 'Date', 'First In', 'Last Out',
      'Office Hours', 'Swipe Details', 'Total Working Hours', 'Break Time', 'Need to Cover', 'Total Hours'
    ];

    const csvContent = [
      headers.join(','),
      ...employeeData.map(emp => [
        emp.employeeCode, emp.employeeName, emp.email, emp.date, emp.firstIn, emp.lastOut,
        emp.officeHours, `"${emp.swipeDetails}"`, emp.totalWorkingHours, emp.breakTime, emp.needToCover, emp.totalHours
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_times_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show setup message if credentials are not configured
  if (!zingCredentials) {
    return (
      <div className="space-y-8">
        {/* Hero Image */}
        <div className="text-center">
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Automated calculation"
            className="rounded-xl shadow-lg mx-auto w-full max-w-3xl h-48 object-cover mb-6"
          />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Automated Zing HR Integration</h3>
          <p className="text-gray-600">Automatically fetch and calculate employee working hours from Zing HR</p>
        </div>

        {/* Setup Required Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Settings className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h4 className="text-xl font-semibold text-yellow-800 mb-2">Setup Required</h4>
          <p className="text-yellow-700 mb-6">
            To use automatic calculation features, you need to configure your Zing HR credentials first.
          </p>
          {onNavigateToZing && (
            <button
              onClick={onNavigateToZing}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              <Settings className="h-5 w-5" />
              <span>Configure Zing Credentials</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="text-center">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200" 
          alt="Automated calculation"
          className="rounded-xl shadow-lg mx-auto w-full max-w-3xl h-48 object-cover mb-6"
        />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Automated Zing HR Integration</h3>
        <p className="text-gray-600">Automatically fetch and calculate employee working hours from Zing HR</p>
      </div>

      {/* Configuration Display */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Current Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600 font-medium">Company Code</p>
            <p className="text-blue-900 font-semibold">{zingCredentials.companyCode}</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-3">
            <p className="text-sm text-teal-600 font-medium">Employee Code</p>
            <p className="text-teal-900 font-semibold">{zingCredentials.employeeCode}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-orange-600 font-medium">Start Date</p>
            <p className="text-orange-900 font-semibold">{zingCredentials.startDate}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-purple-600 font-medium">End Date</p>
            <p className="text-purple-900 font-semibold">{zingCredentials.endDate}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleAutoCalculate}
          disabled={loading}
          className="flex-1 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Fetch Employee Data
            </>
          )}
        </button>

        {employeeData.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      {employeeData.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Employee Working Hours Report
            </h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage Needed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeData.map((employee, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                        <div className="text-sm text-gray-500">{employee.employeeCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.firstIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.lastOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        {employee.totalWorkingHours}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium bg-teal-100 text-teal-800 rounded-full">
                        {employee.breakTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                        employee.needToCover === 'No diff' || employee.needToCover === '00:00'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {employee.needToCover}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};