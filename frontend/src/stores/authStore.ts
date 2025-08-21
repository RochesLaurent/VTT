// frontend/src/stores/authStore.ts
// Ajout de la méthode updateProfile dans le store existant

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User, LoginCredentials, RegisterData } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // État existant
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters existants
  const isAuthenticated = computed(() => !!(user.value && token.value))
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstname || ''} ${user.value.lastname || ''}`.trim() || user.value.pseudo
  })
  const hasRole = computed(() => (role: string) => {
    if (!user.value) return false
    return user.value.roles.includes(role)
  })

  // Actions existantes
  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const authResponse = await authService.login(credentials)
      user.value = authResponse.user
      token.value = authResponse.token
      refreshToken.value = authResponse.refreshToken
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const authResponse = await authService.register(userData)
      user.value = authResponse.user
      token.value = authResponse.token
      refreshToken.value = authResponse.refreshToken
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur d\'inscription'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      token.value = null
      refreshToken.value = null
      isLoading.value = false
    }
  }

  const fetchProfile = async (): Promise<void> => {
    if (!token.value) return

    isLoading.value = true
    try {
      user.value = await authService.getProfile()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de chargement du profil'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshAuth = async (): Promise<void> => {
    if (!refreshToken.value) throw new Error('Pas de refresh token')

    try {
      const authResponse = await authService.refreshToken(refreshToken.value)
      token.value = authResponse.token
      refreshToken.value = authResponse.refreshToken
      user.value = authResponse.user
    } catch (err) {
      logout()
      throw err
    }
  }

  /**
   * Met à jour le profil utilisateur dans le store
   * Utilisé pour synchroniser avec les changements du UserStore
   */
  const updateProfile = (updatedData: Partial<User>): void => {
    if (user.value) {
      user.value = {
        ...user.value,
        ...updatedData
      }
    }
  }

  const initialize = async (): Promise<void> => {
    const storedToken = localStorage.getItem('token')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedToken && storedRefreshToken) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken

      try {
        await fetchProfile()
      } catch (err) {
        console.warn('Session expirée, reconnexion nécessaire')
        logout()
      }
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // État
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Getters
    isAuthenticated,
    userDisplayName,
    hasRole,

    // Actions
    login,
    register,
    logout,
    fetchProfile,
    refreshAuth,
    updateProfile, // Nouvelle méthode
    initialize,
    clearError
  }
})