<template>
  <div class="auth-page">
    <div class="auth-background">
      <div class="gradient-overlay"></div>
      <div class="decoration-elements">
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
      </div>
    </div>

    <div class="auth-content">
      <div class="auth-container">
        <div class="auth-brand">
          <div class="brand-logo">
            <div class="dice-container">
              <svg class="dice-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1" fill="currentColor"/>
                <circle cx="15.5" cy="15.5" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h1 class="text-display-lg brand-title">OnlyRoll</h1>
          <p class="text-body-sm brand-subtitle">Table virtuelle de jeu de rôle</p>
        </div>

        <div class="auth-card">
          <div class="card-header">
            <h2 class="text-h1">Connexion</h2>
            <p class="text-body-sm card-subtitle">Connectez-vous à votre compte OnlyRoll</p>
          </div>

          <div class="card-content">
            <LoginForm
              :redirect-to="redirectTo"
              @success="handleSuccess"
              @error="handleError"
            />
          </div>
        </div>

        <div class="auth-navigation">
          <div class="nav-links">
            <router-link to="/auth/register" class="nav-link primary">
              <span>Pas encore de compte ?</span>
              <strong>Créer un compte</strong>
            </router-link>
            <router-link to="/" class="nav-link secondary">
              ← Retour à l'accueil
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';

const route = useRoute();

const redirectTo = computed(() => {
  return (route.query.redirect as string) || '/dashboard';
});

const handleSuccess = (userData: any) => {
  console.log('Connexion réussie:', userData);
};

const handleError = (error: string) => {
  console.error('Erreur de connexion:', error);
};
</script>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    var(--primary-900) 0%, 
    var(--secondary-900) 25%, 
    var(--primary-800) 50%, 
    var(--secondary-800) 75%, 
    var(--primary-700) 100%
  );
}

.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-500), var(--accent-purple));
  opacity: 0.1;
  filter: blur(1px);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 20%;
  animation-delay: 2s;
}

.orb-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 25%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: var(--space-6);
  animation: slideInUp 0.8s ease-out;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.auth-brand {
  text-align: center;
  margin-bottom: var(--space-4);
}

.brand-logo {
  margin-bottom: var(--space-4);
}

.dice-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-500), var(--accent-purple));
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  margin: 0 auto;
  transition: all var(--transition-normal);
  animation: pulse 2s ease-in-out infinite;
}

.dice-container:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 30px 60px rgba(99, 102, 241, 0.3);
}

.dice-icon {
  width: 40px;
  height: 40px;
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.brand-title {
  background: linear-gradient(135deg, var(--primary-300), var(--accent-purple));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: var(--space-2);
  font-weight: var(--font-weight-extrabold);
}

.brand-subtitle {
  color: var(--text-muted);
  text-align: center;
}

.auth-card {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: 
    var(--shadow-xl),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.auth-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(99, 102, 241, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-header {
  padding: var(--space-8) var(--space-8) var(--space-4);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-subtitle {
  color: var(--text-muted);
  margin-top: var(--space-2);
}

.card-content {
  padding: var(--space-6) var(--space-8) var(--space-8);
}

.auth-navigation {
  text-align: center;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}

.nav-link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  transition: all var(--transition-normal);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--border-radius-lg);
}

.nav-link.primary {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: var(--primary-300);
}

.nav-link.primary:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--primary-400);
  transform: translateY(-2px);
}

.nav-link.secondary {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.nav-link.secondary:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link span {
  font-size: var(--text-sm);
  opacity: 0.8;
}

.nav-link strong {
  font-weight: var(--font-weight-semibold);
  margin-top: var(--space-1);
}

@media (max-width: 640px) {
  .auth-content {
    padding: var(--space-4);
    max-width: 100%;
  }
  
  .auth-container {
    gap: var(--space-6);
  }
  
  .dice-container {
    width: 60px;
    height: 60px;
  }
  
  .dice-icon {
    width: 30px;
    height: 30px;
  }
  
  .brand-title {
    font-size: var(--text-2xl);
  }
  
  .card-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
  }
  
  .card-content {
    padding: var(--space-4) var(--space-6) var(--space-6);
  }
  
  .orb-1 {
    width: 80px;
    height: 80px;
  }
  
  .orb-2 {
    width: 60px;
    height: 60px;
  }
  
  .orb-3 {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .auth-content {
    padding: var(--space-3);
  }
  
  .floating-orb {
    opacity: 0.05;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-orb,
  .dice-container {
    animation: none;
  }
  
  .auth-content {
    animation: none;
  }
}
</style>