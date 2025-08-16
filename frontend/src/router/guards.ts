import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { AuthService } from '@/services/auth.service';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    roles?: string[];
    permissions?: string[];
    title?: string;
    description?: string;
  }
}

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore();
  const meta = to.meta;

  if (!meta.requiresAuth) {
    next();
    return;
  }

  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    next({
      name: 'login',
      query: { 
        redirect: to.fullPath,
        reason: 'auth_required'
      }
    });
    return;
  }

  if (!authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      await authStore.logout();
      next({
        name: 'login',
        query: { 
          redirect: to.fullPath,
          reason: 'session_expired'
        }
      });
      return;
    }
  }

  if (meta.roles && meta.roles.length > 0) {
    const hasRequiredRole = meta.roles.some(role => authStore.hasRole(role));
    
    if (!hasRequiredRole) {
      next({
        name: 'unauthorized',
        query: { 
          reason: 'insufficient_permissions',
          required: meta.roles.join(',')
        }
      });
      return;
    }
  }

  if (meta.permissions && meta.permissions.length > 0) {
    const rolePermissions: Record<string, string[]> = {
      'ROLE_ADMIN': ['*'],
      'ROLE_GM': ['game.create', 'game.manage', 'user.view'],
      'ROLE_PLAYER': ['game.join', 'character.manage'],
      'ROLE_USER': ['profile.view', 'profile.edit'],
    };

    let hasPermission = false;
    
    if (authStore.user) {
      for (const role of authStore.user.roles) {
        const permissions = rolePermissions[role] || [];
        if (permissions.includes('*')) {
          hasPermission = true;
          break;
        }
        
        for (const requiredPermission of meta.permissions) {
          if (permissions.includes(requiredPermission)) {
            hasPermission = true;
            break;
          }
        }
        
        if (hasPermission) break;
      }
    }

    if (!hasPermission) {
      next({
        name: 'unauthorized',
        query: { 
          reason: 'insufficient_permissions',
          required: meta.permissions.join(',')
        }
      });
      return;
    }
  }

  next();
};

export const guestGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const meta = to.meta;

  if (!meta.requiresGuest) {
    next();
    return;
  }

  const isAuthenticated = AuthService.isAuthenticated();

  if (isAuthenticated) {
    const redirectTo = (to.query.redirect as string) || '/dashboard';
    next(redirectTo);
    return;
  }

  next();
};

export const globalGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const meta = to.meta;

  if (meta.title) {
    document.title = `${meta.title} - ${import.meta.env.VITE_APP_NAME || 'Projet J'}`;
  }

  if (meta.requiresGuest) {
    guestGuard(to, from, next);
    return;
  }

  if (meta.requiresAuth) {
    await authGuard(to, from, next);
    return;
  }

  next();
};

export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore();

  if (!AuthService.isAuthenticated() || !authStore.user) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  if (!authStore.hasRole('ROLE_ADMIN')) {
    next({
      name: 'unauthorized',
      query: { reason: 'admin_required' }
    });
    return;
  }

  next();
};

export const gmGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  const authStore = useAuthStore();

  if (!AuthService.isAuthenticated() || !authStore.user) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  if (!authStore.hasRole('ROLE_GM') && !authStore.hasRole('ROLE_ADMIN')) {
    next({
      name: 'unauthorized',
      query: { reason: 'gm_required' }
    });
    return;
  }

  next();
};

export const createRoleGuard = (requiredRoles: string[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): Promise<void> => {
    const authStore = useAuthStore();

    if (!AuthService.isAuthenticated() || !authStore.user) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    const hasRequiredRole = requiredRoles.some(role => authStore.hasRole(role));

    if (!hasRequiredRole) {
      next({
        name: 'unauthorized',
        query: { 
          reason: 'insufficient_role',
          required: requiredRoles.join(',')
        }
      });
      return;
    }

    next();
  };
};

export const canAccessRoute = (routeName: string, user: any): boolean => {
  
  const routePermissions: Record<string, string[]> = {
    'admin': ['ROLE_ADMIN'],
    'gm-dashboard': ['ROLE_ADMIN', 'ROLE_GM'],
    'game-create': ['ROLE_ADMIN', 'ROLE_GM'],
    'game-manage': ['ROLE_ADMIN', 'ROLE_GM'],
    'dashboard': ['ROLE_ADMIN', 'ROLE_GM', 'ROLE_PLAYER', 'ROLE_USER'],
  };

  const requiredRoles = routePermissions[routeName];
  
  if (!requiredRoles) {
    return true;
  }

  if (!user || !user.roles) {
    return false;
  }

  return requiredRoles.some(role => user.roles.includes(role));
};