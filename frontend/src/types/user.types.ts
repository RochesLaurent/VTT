export interface UserProfile {
  id: number;
  email: string;
  username: string;
  pseudo: string;
  firstname: string;
  lastname: string;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  preferences: UserPreferences;
  roles: string[];
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface UserUpdateData {
  email?: string;
  pseudo?: string;
  firstname?: string;
  lastname?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'fr' | 'en';
  notifications?: {
    email?: boolean;
    push?: boolean;
    gameInvites?: boolean;
    messages?: boolean;
    updates?: boolean;
  };
  game?: {
    autoRoll?: boolean;
    showDiceAnimation?: boolean;
    soundEffects?: boolean;
    gridSize?: 'small' | 'medium' | 'large';
  };
  privacy?: {
    showEmail?: boolean;
    showRealName?: boolean;
    allowInvites?: boolean;
  };
}

export interface AccountDeletionData {
  password: string;
  reason?: string;
  feedback?: string;
}

export interface UserStatistics {
  accountAge: number;
  lastActivity: string;
  gamesCreated: number;
  gamesJoined: number;
  charactersCreated: number;
}