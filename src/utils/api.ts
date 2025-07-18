// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  ZING_CREDENTIALS: `${API_BASE_URL}/api/zing-credentials`,
  CALCULATE_MANUAL: `${API_BASE_URL}/api/calculate-manual`,
  CALCULATE_AUTO: `${API_BASE_URL}/api/calculate-auto`,
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(endpoint, {
    ...options,
    headers: defaultHeaders,
  });
}; 