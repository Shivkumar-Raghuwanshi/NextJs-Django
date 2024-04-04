import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { getCookie, setCookie, deleteCookie, CookieValueTypes } from 'cookies-next';

const API_URL = 'http://localhost:8000/training/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach the access token to outgoing requests
api.interceptors.request.use((config) => {
  const accessToken = getCookie('access_token', config.headers.cookie);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle token refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getCookie('refresh_token', originalRequest.headers.cookie);
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
          const accessToken = response.data.access;
          setCookie('access_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          // Handle token refresh failure (e.g., logout the user)
        }
      } else {
        console.error('No refresh token available');
        // Handle the case where there is no refresh token (e.g., redirect to login page)
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  api,
  register: async (username: string, email: string, password: string): Promise<{ refresh: string; access: string }> => {
    try {
      const response: AxiosResponse<{ refresh: string; access: string }> = await api.post('/register/', { username, email, password });
      const { refresh, access } = response.data;
      setCookie('refresh_token', refresh);
      setCookie('access_token', access);
      return { refresh, access };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  login: async (username: string, password: string): Promise<{ refresh: string; access: string }> => {
    try {
      const response: AxiosResponse<{ refresh: string; access: string }> = await api.post('/token/', { username, password });
      const { refresh, access } = response.data;
      setCookie('refresh_token', refresh);
      setCookie('access_token', access);
      return { refresh, access };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: (): void => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  },
  
  
  isAuthenticated: (request: NextRequest): boolean => {
    const accessToken = getCookie('access_token', { req: request }) as CookieValueTypes;
    return !!accessToken;
  },

  getAccessToken: (request: NextRequest): string | null => {
    const accessToken = getCookie('access_token', { req: request }) as CookieValueTypes;
    return accessToken || null;
  },

  getRefreshToken: (request: NextRequest): string | null => {
    const refreshToken = getCookie('refresh_token', { req: request }) as CookieValueTypes;
    return refreshToken || null;
  },
};

export default authService;


