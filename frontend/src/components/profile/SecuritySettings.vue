const<template>
  <div class="space-y-8">
    <!-- Change Password Section -->
    <div>
      <h3 class="text-lg font-semibold text-text-primary mb-4">Changer le mot de passe</h3>
      <form @submit.prevent="handlePasswordChange" class="space-y-4">
        <div>
          <label class="label label-required">Mot de passe actuel</label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="input pr-12"
              :class="{ 'input-error': errors.currentPassword }"
              placeholder="Votre mot de passe actuel"
              required
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              <Eye v-if="!showCurrentPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <div v-if="errors.currentPassword" class="error-text">{{ errors.currentPassword }}</div>
        </div>

        <div>
          <label class="label label-required">Nouveau mot de passe</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="input pr-12"
              :class="{ 'input-error': errors.newPassword }"
              placeholder="Votre nouveau mot de passe"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              <Eye v-if="!showNewPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <div v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</div>
          
          <!-- Password Strength Indicator -->
          <div v-if="passwordForm.newPassword" class="mt-2">
            <div class="flex items-center space-x-2">
              <div class="flex-1 bg-secondary-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="passwordStrength.color"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
              <span class="text-xs text-text-muted">{{ passwordStrength.label }}</span>
            </div>
            
            <div class="mt-2 space-y-1">
              <div 
                v-for="requirement in passwordRequirements"
                :key="requirement.text"
                class="flex items-center space-x-2 text-xs"
              >
                <Check v-if="requirement.met" class="w-3 h-3 text-success" />
                <X v-else class="w-3 h-3 text-error" />
                <span :class="requirement.met ? 'text-success' : 'text-text-muted'">
                  {{ requirement.text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="label label-required">Confirmer le nouveau mot de passe</label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="input pr-12"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <div v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isChangingPassword || !isPasswordFormValid"
          >
            <Loader2 v-if="isChangingPassword" class="w-4 h-4 animate-spin" />
            <Key v-else class="w-4 h-4" />
            Changer le mot de passe
          </button>
        </div>
      </form>
    </div>

    <!-- Security Information -->
    <div class="border-t border-border-primary pt-8">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Informations de sécurité</h3>
      
      <div class="bg-bg-secondary rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Authentification à deux facteurs</div>
            <div class="text-xs text-text-muted">Non configurée</div>
          </div>
          <button class="btn btn-secondary btn-sm" disabled>
            <Shield class="w-4 h-4" />
            Bientôt disponible
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Sessions actives</div>
            <div class="text-xs text-text-muted">1 appareil connecté</div>
          </div>
          <button class="btn btn-ghost btn-sm" disabled>
            <Monitor class="w-4 h-4" />
            Gérer les sessions
          </button>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="border-t border-border-primary pt-8">
      <h3 class="text-lg font-semibold text-error mb-4">Zone de danger</h3>
      
      <div class="bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <AlertTriangle class="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h4 class="text-sm font-medium text-error mb-2">Supprimer mon compte</h4>
            <p class="text-xs text-text-muted mb-4">
              Cette action est irréversible. Toutes vos données, parties et personnages seront définitivement supprimés.
            </p>
            
            <form @submit.prevent="handleDeleteAccount" class="space-y-3">
              <div>
                <label class="label label-required">Confirmez avec votre mot de passe</label>
                <input
                  v-model="deleteForm.password"
                  type="password"
                  class="input"
                  :class="{ 'input-error': errors.deletePassword }"
                  placeholder="Votre mot de passe"
                  required
                />
                <div v-if="errors.deletePassword" class="error-text">{{ errors.deletePassword }}</div>
              </div>
              
              <div class="flex items-center space-x-2">
                <input
                  v-model="deleteForm.confirmation"
                  type="checkbox"
                  id="delete-confirmation"
                  class="w-4 h-4 text-error bg-transparent border-2 border-error rounded focus:ring-error focus:ring-2"
                  required
                />
                <label for="delete-confirmation" class="text-xs text-text-muted">
                  Je comprends que cette action est irréversible
                </label>
              </div>
              
              <button
                type="submit"
                class="btn btn-danger btn-sm"
                :disabled="isDeletingAccount || !deleteForm.password || !deleteForm.confirmation"
              >
                <Loader2 v-if="isDeletingAccount" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
                Supprimer définitivement mon compte
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PasswordChangeData } from '@/types/user.types';

import { 
  Eye, 
  EyeOff,
  Check,
  X,
  Key,
  Shield,
  Monitor,
  AlertTriangle,
  Trash2,
  Loader2
} from 'lucide-vue-next';

interface Emits {
  (e: 'password-change', data: PasswordChangeData): void;
  (e: 'delete-account', password: string): void;
}

const emit = defineEmits<Emits>();

const isChangingPassword = ref(false);
const isDeletingAccount = ref(false);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordForm = ref<PasswordChangeData>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const deleteForm = ref({
  password: '',
  confirmation: false
});

const errors = ref<Record<string, string>>({});

const passwordRequirements = computed(() => [
  {
    text: 'Au moins 8 caractères',
    met: passwordForm.value.newPassword.length >= 8
  },
  {
    text: 'Au moins une majuscule',
    met: /[A-Z]/.test(passwordForm.value.newPassword)
  },
  {
    text: 'Au moins une minuscule',
    met: /[a-z]/.test(passwordForm.value.newPassword)
  },
  {
    text: 'Au moins un chiffre',
    met: /\d/.test(passwordForm.value.newPassword)
  },
  {
    text: 'Au moins un caractère spécial',
    met: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.value.newPassword)
  }
]);

const passwordStrength = computed(() => {
  const metRequirements = passwordRequirements.value.filter(req => req.met).length;
  const percentage = (metRequirements / passwordRequirements.value.length) * 100;
  
  if (percentage < 40) {
    return { percentage, label: 'Faible', color: 'bg-error' };
  } else if (percentage < 80) {
    return { percentage, label: 'Moyen', color: 'bg-warning' };
  } else {
    return { percentage, label: 'Fort', color: 'bg-success' };
  }
});

const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordRequirements.value.every(req => req.met);
});

const validatePasswordForm = (): boolean => {
  errors.value = {};

  if (!passwordForm.value.currentPassword) {
    errors.value.currentPassword = 'Le mot de passe actuel est requis';
  }

  if (!passwordForm.value.newPassword) {
    errors.value.newPassword = 'Le nouveau mot de passe est requis';
  } else if (!passwordRequirements.value.every(req => req.met)) {
    errors.value.newPassword = 'Le mot de passe ne respecte pas tous les critères';
  }

  if (!passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = 'La confirmation est requise';
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return Object.keys(errors.value).length === 0;
};

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return;

  isChangingPassword.value = true;
  
  try {
    emit('password-change', { ...passwordForm.value });
    
    // Reset form on success
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    errors.value = {};
  } finally {
    isChangingPassword.value = false;
  }
};

const handleDeleteAccount = async () => {
  if (!deleteForm.value.password) {
    errors.value.deletePassword = 'Le mot de passe est requis pour confirmer la suppression';
    return;
  }

  if (!deleteForm.value.confirmation) {
    return;
  }

  isDeletingAccount.value = true;
  
  try {
    emit('delete-account', deleteForm.value.password);
  } finally {
    isDeletingAccount.value = false;
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: rgb(239, 68, 68);
  border-color: rgb(239, 68, 68);
}
</style>