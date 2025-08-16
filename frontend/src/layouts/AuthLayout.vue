<template>
  <div class="auth-layout">
    <div class="auth-background">
      <div class="bg-pattern"></div>
      
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <main class="auth-main">
      <div class="auth-content">
        <RouterView />
      </div>
    </main>

    <footer class="auth-footer">
      <div class="footer-content">
        <p class="text-caption">
          © {{ currentYear }} Projet J. Plateforme de table virtuelle pour D&D 5e.
        </p>
        <div class="footer-links">
          <router-link to="/terms" class="footer-link">
            Conditions d'utilisation
          </router-link>
          <span class="separator">•</span>
          <router-link to="/privacy" class="footer-link">
            Confidentialité
          </router-link>
          <span class="separator">•</span>
          <router-link to="/contact" class="footer-link">
            Contact
          </router-link>
        </div>
      </div>
    </footer>

    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <svg class="spinner" fill="none" viewBox="0 0 24 24">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="4" 
              class="opacity-25" 
            />
            <path 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
              class="opacity-75" 
            />
          </svg>
          <p class="loading-text">Chargement...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const currentYear = computed(() => new Date().getFullYear());
const isLoading = computed(() => authStore.isLoading);

const animateShapes = () => {
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, index) => {
    const duration = 20000 + (index * 5000);
    const delay = index * 2000;
    
    shape.animate([
      { transform: 'translateY(0px) rotate(0deg)', opacity: 0.6 },
      { transform: 'translateY(-20px) rotate(180deg)', opacity: 0.8 },
      { transform: 'translateY(0px) rotate(360deg)', opacity: 0.6 }
    ], {
      duration,
      delay,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  });
};

onMounted(() => {
  setTimeout(animateShapes, 1000);
  
  document.body.classList.add('auth-page-active');
});

onUnmounted(() => {
  document.body.classList.remove('auth-page-active');
});
</script>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(135deg, #1a0b2e 0%, #0f172a 50%, #2d1b44 100%);
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  animation: patternMove 30s linear infinite;
}

@keyframes patternMove {
  0% { background-position: 0 0; }
  100% { background-position: 20px 20px; }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  opacity: 0.1;
  backdrop-filter: blur(1px);
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  transform: rotate(45deg);
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  border-radius: 50%;
  background: linear-gradient(45deg, #10b981, #06b6d4);
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  left: 15%;
  transform: rotate(-30deg);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background: linear-gradient(45deg, #f59e0b, #f43f5e);
}

.shape-4 {
  width: 120px;
  height: 40px;
  bottom: 25%;
  right: 10%;
  border-radius: 20px;
  background: linear-gradient(45deg, #06b6d4, #6366f1);
}

.auth-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-content {
  width: 100%;
  max-width: 500px;
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-footer {
  position: relative;
  z-index: 1;
  padding: 1.5rem 1rem;
}

.footer-content {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #cbd5e1;
}

.separator {
  color: #94a3b8;
  font-size: 0.75rem;
}

.text-caption {
  font-size: 0.75rem;
  color: #94a3b8;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6366f1;
}

.spinner {
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #f1f5f9;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .auth-main {
    padding: 1.5rem 0.75rem;
  }
  
  .auth-footer {
    padding: 1rem 0.75rem;
  }
  
  .footer-content {
    gap: 0.5rem;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .separator {
    display: none;
  }
  
  .shape-1 {
    width: 50px;
    height: 50px;
  }
  
  .shape-2 {
    width: 40px;
    height: 40px;
  }
  
  .shape-3 {
    width: 60px;
    height: 60px;
  }
  
  .shape-4 {
    width: 80px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .auth-main {
    padding: 1rem 0.5rem;
  }
  
  .floating-shapes {
    opacity: 0.5;
  }
}

:global(.auth-page-active) {
  overflow-x: hidden;
}

:global(.auth-page-active *) {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #1e293b;
}

:global(.auth-page-active *::-webkit-scrollbar) {
  width: 6px;
}

:global(.auth-page-active *::-webkit-scrollbar-track) {
  background: #1e293b;
}

:global(.auth-page-active *::-webkit-scrollbar-thumb) {
  background: #6366f1;
  border-radius: 3px;
}

:global(.auth-page-active *::-webkit-scrollbar-thumb:hover) {
  background: #818cf8;
}
</style>