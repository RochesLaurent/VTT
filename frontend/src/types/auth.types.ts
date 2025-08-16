export interface User {
  id: number;
  username: string;
  email: string;
  pseudo: string;
  firstname: string;
  lastname: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  pseudo: string;
  password: string;
  passwordConfirm: string;
  firstname: string;
  lastname: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}