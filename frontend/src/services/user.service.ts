import { apiClient } from '@/utils/api';
import type { 
  UserProfile, 
  UserUpdateData, 
  PasswordChangeData, 
  UserPreferences 
} from '@/types/user.types';

export class UserService {
  private static readonly AVATAR_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  static async updateProfile(data: UserUpdateData): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/users/profile', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        throw new Error(error.response.data.message || 'Données invalides');
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  }

  static async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await apiClient.put('/users/password', data);
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Mot de passe actuel incorrect');
      }
      if (error.response?.status === 422) {
        throw new Error('Le nouveau mot de passe ne respecte pas les critères de sécurité');
      }
      throw new Error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    }
  }

  static async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    try {
      const response = await apiClient.put('/users/preferences', preferences);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour des préférences');
    }
  }

  static async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.avatarUrl;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du téléchargement de l\'avatar');
    }
  }

  static async deleteAvatar(): Promise<void> {
    try {
      await apiClient.delete('/users/avatar');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'avatar');
    }
  }

  static async deleteAccount(password: string): Promise<void> {
    try {
      await apiClient.delete('/users/account', {
        data: { password }
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Mot de passe incorrect');
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du compte');
    }
  }

  static validateAvatarFile(file: File): { valid: boolean; error?: string } {
    if (!this.AVATAR_ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'
      };
    }

    if (file.size > this.AVATAR_MAX_SIZE) {
      return {
        valid: false,
        error: 'Le fichier est trop volumineux. Taille maximale : 5MB.'
      };
    }

    return { valid: true };
  }

  static createFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}