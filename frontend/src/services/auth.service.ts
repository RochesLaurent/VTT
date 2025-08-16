import { apiClient, formatApiError, TokenStorage } from '@/utils/api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ForgotPasswordData,
  ResetPasswordData
} from '@/types/auth.types';
import { AxiosError } from 'axios';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      TokenStorage.setTokens(response.data);
      
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      TokenStorage.setTokens(response.data);
      
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      TokenStorage.clearTokens();
    }
  }

  static async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken
      });

      TokenStorage.setTokens(response.data);
      
      return response.data;
    } catch (error) {
      TokenStorage.clearTokens();
      throw formatApiError(error as AxiosError);
    }
  }

  static async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static isAuthenticated(): boolean {
    const token = TokenStorage.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      TokenStorage.clearTokens();
      return false;
    }
  }

  static getToken(): string | null {
    return TokenStorage.getToken();
  }

  static clearAuth(): void {
    TokenStorage.clearTokens();
  }
}