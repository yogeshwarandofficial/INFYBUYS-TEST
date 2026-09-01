import type { ApiQueryParams } from '@/types/api';

const API_BASE_URL = '/api';

export const buildQueryString = (params?: ApiQueryParams): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const handleResponse = async (response: Response, fetchFn: () => Promise<Response>) => {
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      // Don't attempt to refresh if the request was to login or refresh endpoints itself
      const isAuthEndpoint = response.url.includes('/auth/login') || response.url.includes('/auth/refresh');

      if (refreshToken && !isRefreshing && !isAuthEndpoint) {
        isRefreshing = true;
        try {
          const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }
            processQueue(null, data.accessToken);
            return handleResponse(await fetchFn(), fetchFn);
          } else {
            const error = new Error('Refresh failed');
            processQueue(error);
          }
        } catch (error) {
          processQueue(error);
        } finally {
          isRefreshing = false;
        }
      } else if (isRefreshing && !isAuthEndpoint) {
        // Wait for the token refresh to finish
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          return handleResponse(await fetchFn(), fetchFn);
        } catch (err) {
          // Ignore and fall through to logout
        }
      }

      // If we reach here, refresh failed or no refresh token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      const publicPaths = ['/login', '/register', '/verify-email', '/verify-email/confirm'];
      if (typeof window !== 'undefined' && !publicPaths.some(p => window.location.pathname.startsWith(p))) {
        // Import dynamically to avoid circular dependencies
        import('@/store/useUserStore').then(({ useUserStore }) => {
          useUserStore.getState().logout(true);
        });
        window.location.href = '/login';
      }
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || response.statusText || 'API Error');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const apiClient = {
  get: async <T>(url: string, params?: ApiQueryParams): Promise<T> => {
    const queryString = buildQueryString(params);
    const fetchFn = () => fetch(`${API_BASE_URL}${url}${queryString}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const fetchFn = () => fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    const fetchFn = () => fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  },

  patch: async <T>(url: string, data: any): Promise<T> => {
    const fetchFn = () => fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  },

  delete: async <T>(url: string): Promise<T> => {
    const fetchFn = () => fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  },

  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    const fetchFn = () => {
      const token = localStorage.getItem('accessToken');
      return fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
    };
    const response = await fetchFn();
    return handleResponse(response, fetchFn);
  }
};
