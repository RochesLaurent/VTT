import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import type { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '@/types/auth.types';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error);
  const userDisplayName = computed(() => authStore.userDisplayName);

  const login = async (credentials: LoginCredentials, redirectTo: string = '/dashboard'): Promise<void> => {
    try {
      await authStore.login(credentials);
      await router.push(redirectTo);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData, redirectTo: string = '/dashboard'): Promise<void> => {
    try {
      await authStore.register(userData);
      await router.push(redirectTo);
    } catch (error) {
      throw error;
    }
  };

  const logout = async (redirectTo: string = '/login'): Promise<void> => {
    try {
      await authStore.logout();
      await router.push(redirectTo);
    } catch (error) {
      await router.push(redirectTo);
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<string> => {
    return await authStore.forgotPassword(data);
  };

  const resetPassword = async (data: ResetPasswordData, redirectTo: string = '/login'): Promise<void> => {
    try {
      await authStore.resetPassword(data);
      await router.push(redirectTo);
    } catch (error) {
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role);
  };

  const hasPermission = (permission: string): boolean => {
    const rolePermissions: Record<string, string[]> = {
      'ROLE_ADMIN': ['*'], 
      'ROLE_GM': ['game.create', 'game.manage', 'user.view'],
      'ROLE_PLAYER': ['game.join', 'character.manage'],
      'ROLE_USER': ['profile.view', 'profile.edit'],
    };

    if (!user.value) return false;

    for (const role of user.value.roles) {
      const permissions = rolePermissions[role] || [];
      if (permissions.includes('*') || permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  };

  const navigateIfAuthenticated = async (to: string): Promise<void> => {
    if (isAuthenticated.value) {
      await router.push(to);
    } else {
      await router.push('/login');
    }
  };

  const initialize = async (): Promise<void> => {
    await authStore.initialize();
  };

  const clearError = (): void => {
    authStore.clearError();
  };

  const refreshProfile = async (): Promise<void> => {
    await authStore.fetchProfile();
  };

  const canAccessRoute = (requiredRoles?: string[], requiredPermissions?: string[]): boolean => {
    if (!isAuthenticated.value) {
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        return false;
      }
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) {
        return false;
      }
    }

    return true;
  };

  const getDefaultRoute = (): string => {
    if (!user.value) return '/login';

    if (hasRole('ROLE_ADMIN')) {
      return '/admin';
    } else if (hasRole('ROLE_GM')) {
      return '/gm/dashboard';
    } else {
      return '/dashboard';
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userDisplayName,

    login,
    register,
    logout,
    forgotPassword,
    resetPassword,

    hasRole,
    hasPermission,
    navigateIfAuthenticated,
    initialize,
    clearError,
    refreshProfile,

    canAccessRoute,
    getDefaultRoute,
  };
}