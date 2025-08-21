// frontend/src/services/user.service.ts

import { apiClient } from './api.client'
import type { 
  UserProfile, 
  UpdateProfileData, 
  UploadAvatarResponse,
  ApiResponse 
} from '@/types/user.types'

export class UserService {
  private readonly baseUrl = '/api/users'

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>(`${this.baseUrl}/profile`)
    return response.data.data
  }

  /**
   * Met à jour le profil de l'utilisateur
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>(
      `${this.baseUrl}/profile`,
      data
    )
    return response.data.data
  }

  /**
   * Upload un nouvel avatar
   */
  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post<ApiResponse<UploadAvatarResponse>>(
      `${this.baseUrl}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.data
  }

  /**
   * Supprime l'avatar de l'utilisateur
   */
  async deleteAvatar(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/avatar`)
  }

  /**
   * Supprime le compte utilisateur
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/account`)
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  async changePassword(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<void> {
    await apiClient.put(`${this.baseUrl}/password`, data)
  }

  /**
   * Récupère les statistiques de l'utilisateur
   */
  async getStats(): Promise<{
    gamesPlayed: number
    gamesCreated: number
    totalPlayTime: number
    favoriteClass: string
    achievementsUnlocked: number
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/stats`)
    return response.data.data
  }

  /**
   * Récupère l'historique des parties
   */
  async getGamesHistory(params?: {
    page?: number
    limit?: number
    filter?: 'all' | 'active' | 'finished'
  }): Promise<{
    games: any[]
    total: number
    page: number
    pages: number
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.baseUrl}/games`, {
      params
    })
    return response.data.data
  }

  /**
   * Exporte les données utilisateur (RGPD)
   */
  async exportData(): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export`, {
      responseType: 'blob'
    })
    return response.data
  }
}

// Export singleton
export const userService = new UserService()