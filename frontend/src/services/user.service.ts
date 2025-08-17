import { apiClient, formatApiError } from '@/utils/api';
import type { User } from '@/types/auth.types';
import type { UserProfile, UserUpdateData, PasswordChangeData, UserPreferences } from '@/types/user.types';
import { AxiosError } from 'axios';

export class UserService {
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async updateProfile(data: UserUpdateData): Promise<UserProfile> {
    try {
      const response = await apiClient.put<{ message: string; user: UserProfile }>('/users/profile', data);
      return response.data.user;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await apiClient.put('/users/profile', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<{ message: string; avatar: string }>('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.avatar;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async deleteAvatar(): Promise<void> {
    try {
      await apiClient.delete('/users/avatar');
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async deleteAccount(password: string): Promise<void> {
    try {
      await apiClient.delete('/users/account', {
        data: {
          password,
          confirmation: 'DELETE'
        }
      });
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ available: boolean }>('/users/check-email', { email });
      return response.data.available;
    } catch (error) {
      return false;
    }
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ available: boolean }>('/users/check-username', { username });
      return response.data.available;
    } catch (error) {
      return false;
    }
  }

  static async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    try {
      const response = await apiClient.put<{ message: string; preferences: UserPreferences }>('/users/preferences', preferences);
      return response.data.preferences;
    } catch (error) {
      throw formatApiError(error as AxiosError);
    }
  }

  static validateAvatarFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return { valid: false, error: 'Le fichier est trop volumineux (max 5MB)' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Format non supporté. Utilisez JPG, PNG, GIF ou WebP' };
    }

    return { valid: true };
  }

  static getDefaultAvatar(firstname: string, lastname: string): string {
    const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=200`;
  }
}