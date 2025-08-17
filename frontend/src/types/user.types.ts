export interface User {
  id: number;
  email: string;
  username: string;
  pseudo: string;
  firstname?: string;
  lastname?: string;
  roles: string[];
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  pseudo: string;
  firstname?: string;
  lastname?: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string;
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

export interface UserUpdateData {
  email?: string;
  username?: string;
  pseudo?: string;
  firstname?: string;
  lastname?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPreferences {
  theme?: 'dark' | 'light' | 'system';
  language?: 'fr' | 'en';
  dice_animation?: boolean;
  auto_roll_damage?: boolean;
  show_spell_descriptions?: boolean;
  grid_snap?: boolean;
  measurement_unit?: 'feet' | 'meters';
}

export interface UserStatistics {
  accountAge: number;
  lastActivity: string;
  gamesCreated: number;
  gamesJoined: number;
  charactersCreated: number;
  hoursPlayed?: number;
  messagesPosted?: number;
  diceRolled?: number;
  favoriteSystem?: string;
  mostPlayedCharacter?: {
    name: string;
    class: string;
    level: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  pseudo: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}