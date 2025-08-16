<template>
  <div class="forgot-password-form">
    <div class="form-header">
      <h2 class="text-h2">Mot de passe oublié</h2>
      <p class="text-body-sm">
        Saisissez votre adresse email pour recevoir un lien de réinitialisation
      </p>
    </div>

    <div v-if="isSuccess" class="alert alert-success" role="alert">
      <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p class="alert-title">Email envoyé !</p>
        <p class="alert-message">{{ successMessage }}</p>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-error" role="alert">
      <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-if="!isSuccess">
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
          <div v-else class="helper-text">
            L'adresse email associée à votre compte
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
          <span v-if="isLoading">Envoi en cours...</span>
          <span v-else>Envoyer le lien</span>
        </button>
      </form>
    </div>

    <div v-else class="success-actions">
      <button
        @click="resetForm"
        class="btn btn-secondary btn-md"
      >
        Renvoyer un email
      </button>
    </div>

    <div class="form-footer">
      <p class="text-body-sm">
        <router-link to="/login" class="link">
          ← Retour à la connexion
        </router-link>
      </p>
      <p class="text-body-sm">
        Pas encore de compte ?
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
import { authValidationSchemas } from '@/utils/validation';
import type { ForgotPasswordData } from '@/types/auth.types';

const emit = defineEmits<{
  success: [email: string];
  error: [error: string];
}>();

const { forgotPassword, isLoading, error, clearError } = useAuth();

const isSuccess = ref(false);
const successMessage = ref('');

const formData = reactive<ForgotPasswordData>({
  email: '',
});

const errors = reactive<Record<string, string>>({});

const isFormValid = computed(() => {
  return formData.email.length > 0 && Object.keys(errors).length === 0;
});

const validateField = async (fieldName: keyof ForgotPasswordData): Promise<void> => {
  try {
    await authValidationSchemas.forgotPassword.validateAt(fieldName, formData);
    delete errors[fieldName];
  } catch (err: any) {
    errors[fieldName] = err.message;
  }
};

const validateForm = async (): Promise<boolean> => {
  try {
    await authValidationSchemas.forgotPassword.validate(formData, { abortEarly: false });
    
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
    const message = await forgotPassword(formData);
    
    isSuccess.value = true;
    successMessage.value = message;
    
    emit('success', formData.email);
  } catch (err: any) {
    emit('error', err.message || 'Erreur lors de l\'envoi de l\'email');
  }
};

const resetForm = (): void => {
  isSuccess.value = false;
  successMessage.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);
  clearError();
};

const clearForm = (): void => {
  formData.email = '';
  resetForm();
};

defineExpose({
  resetForm,
  clearForm,
  validateForm,
});
</script>

<style scoped>
.forgot-password-form {
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

.success-actions {
  display: flex;
  justify-content: center;
  margin: var(--space-6) 0;
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
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.alert {
  display: flex;
  align-items: flex-start;
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

.alert-success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-title {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-1);
}

.alert-message {
  font-size: var(--text-sm);
  line-height: var(--line-height-relaxed);
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
  .forgot-password-form {
    padding: 0 var(--space-4);
  }
  
  .form-footer {
    gap: var(--space-4);
  }
}
</style>