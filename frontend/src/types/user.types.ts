/**
 * Interface pour le profil utilisateur complet
 */
export interface UserProfile {
  id: number
  email: string
  pseudo: string
  firstname?: string
  lastname?: string
  bio?: string
  avatarUrl?: string
  roles: string[]
  notifications?: NotificationPreferences
  createdAt: string
  updatedAt: string
  lastLogin?: string
  isActive: boolean
  emailVerified: boolean
}

/**
 * Préférences de notification
 */
export interface NotificationPreferences {
  email: boolean
  gameInvites: boolean
  newsletter: boolean
}

/**
 * Données pour la mise à jour du profil
 */
export interface UpdateProfileData {
  firstname?: string
  lastname?: string
  pseudo: string
  email: string
  bio?: string
  notifications?: NotificationPreferences
}

/**
 * Réponse de l'upload d'avatar
 */
export interface UploadAvatarResponse {
  avatarUrl: string
  thumbnailUrl?: string
}

/**
 * Données pour le changement de mot de passe
 */
export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Statistiques utilisateur
 */
export interface UserStats {
  gamesPlayed: number
  gamesCreated: number
  totalPlayTime: number
  favoriteClass: string
  achievementsUnlocked: number
  level?: number
  experience?: number
}

/**
 * Historique de partie
 */
export interface GameHistory {
  id: number
  name: string
  code: string
  role: 'master' | 'player'
  status: 'active' | 'finished' | 'paused'
  lastPlayed: string
  playTime: number
  playerCount: number
}

/**
 * Réponse API générique
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Erreur API
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  statusCode: number
}