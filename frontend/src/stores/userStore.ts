// frontend/src/stores/userStore.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { userService } from '@/services/user.service'
import type { 
  UserProfile, 
  UpdateProfileData, 
  UploadAvatarResponse 
} from '@/types/user.types'

export const useUserStore = defineStore('user', () => {
  // État
  const profile = ref<UserProfile | null>(null)
  const avatarUrl = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const updateOptimistic = ref(false)

  // Store d'authentification
  const authStore = useAuthStore()

  // Getters
  const currentProfile = computed(() => profile.value || authStore.user)
  const displayName = computed(() => {
    const user = currentProfile.value
    if (!user) return ''
    
    if (user.firstname || user.lastname) {
      return `${user.firstname || ''} ${user.lastname || ''}`.trim()
    }
    return user.pseudo
  })

  // Actions
  const loadProfile = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const userProfile = await userService.getProfile()
      profile.value = userProfile
      avatarUrl.value = userProfile.avatarUrl || null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du profil'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    isLoading.value = true
    error.value = null

    // Sauvegarde pour rollback en cas d'erreur
    const previousProfile = profile.value
    const previousAuthUser = authStore.user

    // Mise à jour optimiste
    if (updateOptimistic.value && profile.value) {
      profile.value = {
        ...profile.value,
        ...data
      }
      
      // Mise à jour du store auth aussi
      if (authStore.user) {
        authStore.updateProfile({
          firstname: data.firstname,
          lastname: data.lastname,
          pseudo: data.pseudo,
          email: data.email,
          bio: data.bio,
          notifications: data.notifications
        })
      }
    }

    try {
      const updatedProfile = await userService.updateProfile(data)
      profile.value = updatedProfile
      
      // Synchroniser avec le store auth
      if (authStore.user) {
        authStore.updateProfile({
          firstname: updatedProfile.firstname,
          lastname: updatedProfile.lastname,
          pseudo: updatedProfile.pseudo,
          email: updatedProfile.email,
          bio: updatedProfile.bio,
          notifications: updatedProfile.notifications
        })
      }
    } catch (err) {
      // Rollback en cas d'erreur
      if (updateOptimistic.value) {
        profile.value = previousProfile
        if (previousAuthUser) {
          authStore.updateProfile(previousAuthUser)
        }
      }
      
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const uploadAvatar = async (file: File): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response: UploadAvatarResponse = await userService.uploadAvatar(file)
      avatarUrl.value = response.avatarUrl
      
      // Mise à jour du profil
      if (profile.value) {
        profile.value.avatarUrl = response.avatarUrl
      }
      
      // Mise à jour du store auth
      if (authStore.user) {
        authStore.updateProfile({ avatarUrl: response.avatarUrl })
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'upload'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAvatar = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await userService.deleteAvatar()
      avatarUrl.value = null
      
      // Mise à jour du profil
      if (profile.value) {
        profile.value.avatarUrl = undefined
      }
      
      // Mise à jour du store auth
      if (authStore.user) {
        authStore.updateProfile({ avatarUrl: undefined })
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAccount = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      await userService.deleteAccount()
      
      // Nettoyer l'état
      profile.value = null
      avatarUrl.value = null
      
      // La déconnexion sera gérée par le composant appelant
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du compte'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const setOptimisticUpdate = (value: boolean): void => {
    updateOptimistic.value = value
  }

  const resetStore = (): void => {
    profile.value = null
    avatarUrl.value = null
    error.value = null
    isLoading.value = false
    updateOptimistic.value = false
  }

  // Export
  return {
    // État
    profile: computed(() => profile.value),
    avatarUrl: computed(() => avatarUrl.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Getters
    currentProfile,
    displayName,
    
    // Actions
    loadProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    deleteAccount,
    clearError,
    setOptimisticUpdate,
    resetStore
  }
})