// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000';
const MOCK_CURRENT_USER_KEY = 'mock_auth_current_user';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const shouldUseMockFallback = (error: unknown): boolean => {
  if (!(error instanceof ApiError)) {
    return true;
  }

  if (!error.status) {
    return true;
  }

  return error.status === 404 || error.status === 405 || error.status >= 500;
};

// API Client with error handling and token management
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private isMockSessionActive(): boolean {
    const token = this.token || localStorage.getItem('auth_token');
    const hasMockUser = !!localStorage.getItem(MOCK_CURRENT_USER_KEY);
    return !!token?.startsWith('mock-token-') || hasMockUser;
  }

  private shouldBypassNetwork(endpoint: string): boolean {
    if (!this.isMockSessionActive()) {
      return false;
    }

    // Allow explicit auth entrypoints to still hit backend if needed.
    return !endpoint.startsWith('/auth/signin') && !endpoint.startsWith('/auth/signup');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (this.shouldBypassNetwork(endpoint)) {
      throw new ApiError('Using mock session', 503);
    }

    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      ...options.headers,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null);
          window.location.href = '/signin';
          throw new ApiError('Unauthorized', 401);
        }
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new ApiError(error.message || `HTTP ${response.status}`, response.status);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new ApiError('Network request failed');
      }

      throw new ApiError('Request failed');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData ? data : data ? JSON.stringify(data) : undefined;
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL, WS_BASE_URL };
