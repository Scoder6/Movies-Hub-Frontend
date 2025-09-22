import { User } from '@/types';

// Helper function for API requests with credentials
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include', // Required for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      response.status === 429 
        ? 'Too many requests. Please try again later.' 
        : error.message || 'Request failed'
    );
  }

  return response.json();
};

export const authApi = {
  // Login user
  login: async (email: string, password: string): Promise<User> => {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register new user
  signup: async (name: string, email: string, password: string): Promise<User> => {
    return apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await apiFetch('/api/auth/me');
    } catch (error) {
      return null;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  },
};