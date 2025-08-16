<template>
  <div class="login-form">
    <div class="form-header">
      <h2 class="text-h2">Connexion</h2>
      <p class="text-body-sm">
        Connectez-vous à votre compte OnlyRoll
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
            autocomplete="current-password"
            :disabled="isLoading"
            @blur="validateField('password')"
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
        <div v-if="errors.password" class="error-text">
          {{ errors.password }}
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-wrapper">
          <input
            v-model="formData.rememberMe"
            type="checkbox"
            class="checkbox"
            :disabled="isLoading"
          />
          <span class="checkbox-label">Se souvenir de moi</span>
        </label>

        <router-link to="/forgot-password" class="link">
          Mot de passe oublié ?
        </router-link>
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
        <span v-if="isLoading">Connexion...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>

    <div class="form-footer">
      <p class="text-body-sm">
        Vous n'avez pas de compte ?
        <router-link to="/register" class="link">
          Créer un compte
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { authValidationSchemas, validateField as validateSingleField } from '@/utils/validation';
import type { LoginCredentials } from '@/types/auth.types';

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

const { login, isLoading, error, clearError } = useAuth();

const showPassword = ref(false);

const formData = reactive<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false,
});

const errors = reactive<Record<string, string>>({});

const isFormValid = computed(() => {
  return formData.email.length > 0 && 
         formData.password.length > 0 && 
         Object.keys(errors).length === 0;
});

const validateField = async (fieldName: keyof LoginCredentials): Promise<void> => {
  try {
    await authValidationSchemas.login.validateAt(fieldName, formData);
    delete errors[fieldName];
  } catch (err: any) {
    errors[fieldName] = err.message;
  }
};

const validateForm = async (): Promise<boolean> => {
  try {
    await authValidationSchemas.login.validate(formData, { abortEarly: false });
    
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

const handleSubmit = async (): Promise<void> => {
  clearError();
  
  const isValid = await validateForm();
  if (!isValid) {
    return;
  }

  try {
    await login(formData, props.redirectTo);
    emit('success', formData);
  } catch (err: any) {
    emit('error', err.message || 'Erreur de connexion');
  }
};

const resetForm = (): void => {
  formData.email = '';
  formData.password = '';
  formData.rememberMe = false;
  Object.keys(errors).forEach(key => delete errors[key]);
  clearError();
};

defineExpose({
  resetForm,
  validateForm,
});
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
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

@media (max-width: 480px) {
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
}
</style>