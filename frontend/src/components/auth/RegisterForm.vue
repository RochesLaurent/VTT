<template>
  <div class="register-form">
    <div class="form-header">
      <h2 class="text-h2">Créer un compte</h2>
      <p class="text-body-sm">
        Rejoignez la communauté OnlyRoll
      </p>
    </div>

    <div v-if="error" class="alert alert-error" role="alert">
      <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
      <div class="form-group">
        <label for="username" class="label label-required">
          Nom d'utilisateur
        </label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="input"
          :class="{ 'input-error': errors.username }"
          placeholder="nom_utilisateur"
          autocomplete="username"
          :disabled="isLoading"
          @blur="validateField('username')"
        />
        <div v-if="errors.username" class="error-text">
          {{ errors.username }}
        </div>
        <div v-else class="helper-text">
          3-20 caractères : lettres, chiffres, - et _
        </div>
      </div>

      <div class="form-group">
        <label for="pseudo" class="label label-required">
          Pseudo
        </label>
        <input
          id="pseudo"
          v-model="formData.pseudo"
          type="text"
          class="input"
          :class="{ 'input-error': errors.pseudo }"
          placeholder="Mon super pseudo"
          :disabled="isLoading"
          @blur="validateField('pseudo')"
        />
        <div v-if="errors.pseudo" class="error-text">
          {{ errors.pseudo }}
        </div>
        <div v-else class="helper-text">
          Nom affiché publiquement (3-250 caractères)
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="firstname" class="label label-required">
            Prénom
          </label>
          <input
            id="firstname"
            v-model="formData.firstname"
            type="text"
            class="input"
            :class="{ 'input-error': errors.firstname }"
            placeholder="Jean"
            autocomplete="given-name"
            :disabled="isLoading"
            @blur="validateField('firstname')"
          />
          <div v-if="errors.firstname" class="error-text">
            {{ errors.firstname }}
          </div>
        </div>

        <div class="form-group">
          <label for="lastname" class="label label-required">
            Nom
          </label>
          <input
            id="lastname"
            v-model="formData.lastname"
            type="text"
            class="input"
            :class="{ 'input-error': errors.lastname }"
            placeholder="Dupont"
            autocomplete="family-name"
            :disabled="isLoading"
            @blur="validateField('lastname')"
          />
          <div v-if="errors.lastname" class="error-text">
            {{ errors.lastname }}
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="email" class="label label-required">
          Adresse email
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="input"
          :class="{ 'input-error': errors.email }"
          placeholder="votre.email@exemple.com"
          autocomplete="email"
          :disabled="isLoading"
          @blur="validateField('email')"
        />
        <div v-if="errors.email" class="error-text">
          {{ errors.email }}
        </div>
      </div>

      <div class="form-group">
        <label for="password" class="label label-required">
          Mot de passe
        </label>
        <div class="input-wrapper">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            class="input"
            :class="{ 'input-error': errors.password }"
            placeholder="••••••••"
            autocomplete="new-password"
            :disabled="isLoading"
            @blur="validateField('password')"
            @input="updatePasswordStrength"
          />
          <button
            type="button"
            class="input-toggle-password"
            @click="showPassword = !showPassword"
            :disabled="isLoading"
            :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <svg v-if="showPassword" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        
        <div v-if="formData.password" class="password-strength">
          <div class="password-strength-bar">
            <div 
              class="password-strength-fill"
              :class="getPasswordStrengthClass(passwordStrength.score)"
              :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
            ></div>
          </div>
          <div class="password-strength-text">
            <span :class="getPasswordStrengthClass(passwordStrength.score)">
              {{ getPasswordStrengthLabel(passwordStrength.score) }}
            </span>
          </div>
        </div>

        <div v-if="errors.password" class="error-text">
          {{ errors.password }}
        </div>
        <div v-else-if="passwordStrength.feedback.length > 0" class="helper-text">
          {{ passwordStrength.feedback.join(', ') }}
        </div>
      </div>

      <div class="form-group">
        <label for="passwordConfirm" class="label label-required">
          Confirmer le mot de passe
        </label>
        <div class="input-wrapper">
          <input
            id="passwordConfirm"
            v-model="formData.passwordConfirm"
            :type="showPasswordConfirm ? 'text' : 'password'"
            class="input"
            :class="{ 'input-error': errors.passwordConfirm }"
            placeholder="••••••••"
            autocomplete="new-password"
            :disabled="isLoading"
            @blur="validateField('passwordConfirm')"
          />
          <button
            type="button"
            class="input-toggle-password"
            @click="showPasswordConfirm = !showPasswordConfirm"
            :disabled="isLoading"
            :aria-label="showPasswordConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <svg v-if="showPasswordConfirm" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
            <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        <div v-if="errors.passwordConfirm" class="error-text">
          {{ errors.passwordConfirm }}
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-wrapper">
          <input
            v-model="formData.acceptTerms"
            type="checkbox"
            class="checkbox"
            :class="{ 'checkbox-error': errors.acceptTerms }"
            :disabled="isLoading"
            @change="validateField('acceptTerms')"
          />
          <span class="checkbox-label">
            J'accepte les 
            <router-link to="/terms" class="link" target="_blank">
              conditions d'utilisation
            </router-link>
            et la 
            <router-link to="/privacy" class="link" target="_blank">
              politique de confidentialité
            </router-link>
          </span>
        </label>
        <div v-if="errors.acceptTerms" class="error-text">
          {{ errors.acceptTerms }}
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-lg w-full"
        :disabled="isLoading || !isFormValid"
      >
        <svg v-if="isLoading" class="btn-spinner" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75" />
        </svg>
        <span v-if="isLoading">Création du compte...</span>
        <span v-else>Créer mon compte</span>
      </button>
    </form>

    <div class="form-footer">
      <p class="text-body-sm">
        Vous avez déjà un compte ?
        <router-link to="/login" class="link">
          Se connecter
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { authValidationSchemas, customValidators } from '@/utils/validation';
import type { RegisterData } from '@/types/auth.types';

interface Props {
  redirectTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/dashboard',
});

const emit = defineEmits<{
  success: [user: any];
  error: [error: string];
}>();

const { register, isLoading, error, clearError } = useAuth();

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const formData = reactive<RegisterData>({
  username: '',
  email: '',
  pseudo: '',
  firstname: '',
  lastname: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
});

const errors = reactive<Record<string, string>>({});

const passwordStrength = ref({ score: 0, feedback: [] as string[] });

const isFormValid = computed(() => {
  return formData.username.length > 0 && 
         formData.email.length > 0 && 
         formData.pseudo.length > 0 && 
         formData.firstname.length > 0 && 
         formData.lastname.length > 0 && 
         formData.password.length > 0 && 
         formData.passwordConfirm.length > 0 && 
         formData.acceptTerms &&
         Object.keys(errors).length === 0;
});

const validateField = async (fieldName: keyof RegisterData): Promise<void> => {
  try {
    await authValidationSchemas.register.validateAt(fieldName, formData);
    delete errors[fieldName];
  } catch (err: any) {
    errors[fieldName] = err.message;
  }
};

const validateForm = async (): Promise<boolean> => {
  try {
    await authValidationSchemas.register.validate(formData, { abortEarly: false });
    
    Object.keys(errors).forEach(key => delete errors[key]);
    
    return true;
  } catch (err: any) {
    Object.keys(errors).forEach(key => delete errors[key]);
    
    if (err.inner) {
      err.inner.forEach((error: any) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
    }
    
    return false;
  }
};

const updatePasswordStrength = (): void => {
  passwordStrength.value = customValidators.getPasswordStrength(formData.password);
};

const getPasswordStrengthClass = (score: number): string => {
  if (score <= 1) return 'strength-weak';
  if (score <= 2) return 'strength-fair';
  if (score <= 3) return 'strength-good';
  if (score <= 4) return 'strength-strong';
  return 'strength-excellent';
};

const getPasswordStrengthLabel = (score: number): string => {
  if (score <= 1) return 'Faible';
  if (score <= 2) return 'Moyen';
  if (score <= 3) return 'Bon';
  if (score <= 4) return 'Fort';
  return 'Excellent';
};

const handleSubmit = async (): Promise<void> => {
  clearError();
  
  const isValid = await validateForm();
  if (!isValid) {
    return;
  }

  try {
    await register(formData, props.redirectTo);
    emit('success', formData);
  } catch (err: any) {
    emit('error', err.message || 'Erreur lors de la création du compte');
  }
};

const resetForm = (): void => {
  formData.username = '';
  formData.email = '';
  formData.pseudo = '';
  formData.firstname = '';
  formData.lastname = '';
  formData.password = '';
  formData.passwordConfirm = '';
  formData.acceptTerms = false;
  Object.keys(errors).forEach(key => delete errors[key]);
  passwordStrength.value = { score: 0, feedback: [] };
  clearError();
};

defineExpose({
  resetForm,
  validateForm,
});
</script>

<style scoped>
.register-form {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.form-header h2 {
  margin-bottom: var(--space-2);
  color: var(--text-primary);
}

.form-header p {
  color: var(--text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-toggle-password {
  position: absolute;
  right: var(--space-3);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-fast);
}

.input-toggle-password:hover {
  color: var(--text-secondary);
}

.input-toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-toggle-password .icon {
  width: 20px;
  height: 20px;
}

.password-strength {
  margin-top: var(--space-2);
}

.password-strength-bar {
  width: 100%;
  height: 4px;
  background-color: var(--secondary-700);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.password-strength-fill {
  height: 100%;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
}

.password-strength-text {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
}

.strength-weak {
  background-color: #ef4444;
  color: #ef4444;
}

.strength-fair {
  background-color: #f97316;
  color: #f97316;
}

.strength-good {
  background-color: #eab308;
  color: #eab308;
}

.strength-strong {
  background-color: #22c55e;
  color: #22c55e;
}

.strength-excellent {
  background-color: #10b981;
  color: #10b981;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
  line-height: var(--line-height-relaxed);
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.checkbox-error {
  border-color: var(--error);
}

.checkbox-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

.w-full {
  width: 100%;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  margin-right: var(--space-2);
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

.form-footer {
  text-align: center;
  margin-top: var(--space-4);
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-4);
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--error);
  color: var(--error);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.link {
  color: var(--primary-400);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.link:hover {
  color: var(--primary-300);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .register-form {
    max-width: 100%;
    padding: 0 var(--space-4);
  }
}

@media (max-width: 480px) {
  .checkbox-wrapper {
    align-items: flex-start;
  }
}
</style>