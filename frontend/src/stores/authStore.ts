import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { AuthService } from '@/services/auth.service';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData,
  ResetPasswordData,
  ApiError
} from '@/types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    return !!(user.value && token.value && AuthService.isAuthenticated());
  });

  const userDisplayName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstname} ${user.value.lastname}`.trim() || user.value.username;
  });

  const hasRole = computed(() => {
    return (role: string) => {
      if (!user.value) return false;
      return user.value.roles.includes(role);
    };
  });

  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const authResponse = await AuthService.login(credentials);
      
      user.value = authResponse.user;
      token.value = authResponse.token;
      refreshToken.value = authResponse.refreshToken;
      
      error.value = null;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const authResponse = await AuthService.register(userData);
      
      user.value = authResponse.user;
      token.value = authResponse.token;
      refreshToken.value = authResponse.refreshToken;
      
      error.value = null;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await AuthService.logout();
    } catch (err) {
      console.warn('Erreur lors de la déconnexion:', err);
    } finally {
      user.value = null;
      token.value = null;
      refreshToken.value = null;
      error.value = null;
      isLoading.value = false;
    }
  };

  const fetchProfile = async (): Promise<void> => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const userProfile = await AuthService.getProfile();
      user.value = userProfile;
      token.value = AuthService.getToken();
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      
      if (apiError.code === 'UNAUTHORIZED') {
        await logout();
      }
      
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const authResponse = await AuthService.refreshToken();
      
      user.value = authResponse.user;
      token.value = authResponse.token;
      refreshToken.value = authResponse.refreshToken;
      
      error.value = null;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      
      await logout();
      throw err;
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<string> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await AuthService.forgotPassword(data);
      return response.message;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<string> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await AuthService.resetPassword(data);
      return response.message;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const initialize = async (): Promise<void> => {
    if (AuthService.isAuthenticated()) {
      try {
        await fetchProfile();
      } catch (err) {
        console.warn('Erreur lors de l\'initialisation:', err);
        AuthService.clearAuth();
      }
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const updateProfile = (updatedUser: Partial<User>): void => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
    }
  };

  // === Retour des propriétés et méthodes ===
  return {
    // État
    user: readonly(user),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computed
    isAuthenticated,
    userDisplayName,
    hasRole,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    refreshAuth,
    forgotPassword,
    resetPassword,
    initialize,
    clearError,
    updateProfile,
  };
});