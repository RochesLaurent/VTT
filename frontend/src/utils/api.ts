import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, ApiError } from '@/types/auth.types';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

class TokenStorage {
  private static readonly TOKEN_KEY = 'projet_j_token';
  private static readonly REFRESH_TOKEN_KEY = 'projet_j_refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(auth: AuthResponse): void {
    this.setToken(auth.token);
    this.setRefreshToken(auth.refreshToken);
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, on met la requête en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenStorage.getRefreshToken();

      if (!refreshToken) {
        TokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken
        });

        const { token, refreshToken: newRefreshToken } = response.data;
        
        TokenStorage.setToken(token);
        TokenStorage.setRefreshToken(newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        processQueue(null, token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const formatApiError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    const data = error.response.data as any;
    return {
      message: data.message || 'Une erreur est survenue',
      code: data.code,
      errors: data.errors,
    };
  }

  if (error.request) {
    return {
      message: 'Impossible de contacter le serveur',
      code: 'NETWORK_ERROR',
    };
  }

  return {
    message: error.message || 'Une erreur inconnue est survenue',
    code: 'UNKNOWN_ERROR',
  };
};

export { TokenStorage };