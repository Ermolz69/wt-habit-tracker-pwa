export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Send cookies
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized logic centrally if needed
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'API Request Failed');
  }

  return response.json();
};
