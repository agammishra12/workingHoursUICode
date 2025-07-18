// API Configuration for Netlify Functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  ZING_CREDENTIALS: `${API_BASE_URL}/zing-credentials`,
  CALCULATE_MANUAL: `${API_BASE_URL}/calculate-manual`,
  CALCULATE_AUTO: `${API_BASE_URL}/calculate-auto`,
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