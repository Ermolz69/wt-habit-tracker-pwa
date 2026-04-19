export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'API Request Failed');
  }

  return response.json() as Promise<T>;
};

export const fetchWithAuth = <T>(endpoint: string, options: RequestInit = {}) =>
  apiRequest<T>(endpoint, options);
