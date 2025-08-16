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
                <path d="M12 12L2 17v10l10 5 10-5V17L12 12z" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h1 class="text-display-lg brand-title">OnlyRoll</h1>
          <p class="text-body-sm brand-subtitle">Récupération de compte</p>
        </div>

        <div class="auth-card">
          <div class="card-header">
            <h2 class="text-h1">Mot de passe oublié</h2>
            <p class="text-body-sm card-subtitle">
              Pas de panique ! Saisissez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <div class="card-content">
            <ForgotPasswordForm
              @success="handleSuccess"
              @error="handleError"
            />
          </div>
        </div>

        <div class="auth-navigation">
          <div class="nav-links">
            <router-link to="/auth/login" class="nav-link primary">
              <span>← Retour à la connexion</span>
            </router-link>
            <div class="nav-divider">
              <span class="divider-line"></span>
              <span class="divider-text">ou</span>
              <span class="divider-line"></span>
            </div>
            <router-link to="/auth/register" class="nav-link secondary">
              <span>Pas encore de compte ?</span>
              <strong>Créer un compte</strong>
            </router-link>
          </div>
        </div>
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
  background: linear-gradient(45deg, var(--accent-amber), var(--accent-rose));
  opacity: 0.08;
  filter: blur(2px);
  animation: float 10s ease-in-out infinite;
}

.orb-1 {
  width: 150px;
  height: 150px;
  top: 20%;
  left: 12%;
  animation-delay: 0s;
}

.orb-2 {
  width: 90px;
  height: 90px;
  top: 65%;
  right: 18%;
  animation-delay: 3s;
}

.orb-3 {
  width: 110px;
  height: 110px;
  bottom: 15%;
  left: 25%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.08;
  }
  50% { 
    transform: translateY(-25px) rotate(180deg) scale(1.1); 
    opacity: 0.12;
  }
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
  background: linear-gradient(135deg, var(--accent-amber), var(--accent-rose));
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  margin: 0 auto;
  transition: all var(--transition-normal);
  animation: pulse 3s ease-in-out infinite;
}

.dice-container:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 30px 60px rgba(245, 158, 11, 0.3);
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
  background: linear-gradient(135deg, var(--accent-amber), var(--accent-rose));
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
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--border-radius-xl);
  box-shadow: 
    var(--shadow-xl),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.auth-card:hover {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(245, 158, 11, 0.2),
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
  line-height: var(--line-height-relaxed);
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
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: var(--accent-amber);
  font-weight: var(--font-weight-medium);
}

.nav-link.primary:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: var(--accent-amber);
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

.nav-divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  margin: var(--space-2) 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-primary), transparent);
}

.divider-text {
  font-size: var(--text-xs);
  color: var(--text-muted);
  padding: 0 var(--space-2);
  background: var(--bg-primary);
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
    width: 100px;
    height: 100px;
  }
  
  .orb-2 {
    width: 60px;
    height: 60px;
  }
  
  .orb-3 {
    width: 75px;
    height: 75px;
  }
}

@media (max-width: 480px) {
  .auth-content {
    padding: var(--space-3);
  }
  
  .floating-orb {
    opacity: 0.04;
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