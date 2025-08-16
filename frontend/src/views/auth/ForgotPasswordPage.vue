<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-brand">
        <div class="brand-logo">🎲</div>
        <h1 class="brand-title">OnlyRoll</h1>
        <p class="brand-subtitle">Récupération de compte</p>
      </div>

      <div class="auth-form-container">
        <ForgotPasswordForm 
          @success="handleSuccess"
          @error="handleError"
        />
      </div>

      <div class="auth-links">
        <router-link to="/login" class="link">
          ← Retour à la connexion
        </router-link>
        <span class="separator">•</span>
        <router-link to="/register" class="link">
          Créer un compte
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordForm from '@/components/auth/ForgotPassword.vue';

const handleSuccess = (email: string) => {
  console.log('Email de récupération envoyé à:', email);
};

const handleError = (error: string) => {
  console.error('Erreur de récupération:', error);
};
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-height: 100vh;
}

.auth-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.auth-brand {
  text-align: center;
  margin-bottom: 1rem;
}

.brand-logo {
  font-size: 4rem;
  margin: 0 auto 1rem;
  display: block;
}

.brand-title {
  font-family: 'Figtree', sans-serif;
  font-size: 1.875rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
}

.brand-subtitle {
  font-size: 1.125rem;
  color: #94a3b8;
  font-weight: 500;
}

.auth-form-container {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.auth-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
}

.separator {
  color: #94a3b8;
  font-weight: 500;
}

.link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.15s ease;
}

.link:hover {
  color: #a5b4fc;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-page {
    padding: 0.5rem;
  }
  
  .auth-container {
    gap: 1.5rem;
  }
  
  .auth-form-container {
    padding: 1.5rem;
  }
  
  .brand-logo {
    font-size: 3rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .auth-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .auth-form-container {
    padding: 1rem;
  }
}
</style>