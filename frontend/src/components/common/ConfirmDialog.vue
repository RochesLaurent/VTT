<template>
  <div 
    class="modal-backdrop"
    @click="$emit('cancel')"
  >
    <div 
      class="confirm-dialog"
      :class="`confirm-dialog--${type}`"
      @click.stop
    >
      <div class="confirm-dialog__header">
        <div class="confirm-dialog__icon">
          <component :is="iconComponent" class="w-6 h-6" />
        </div>
        <h3 class="confirm-dialog__title">{{ title }}</h3>
      </div>

      <div class="confirm-dialog__content">
        <p class="confirm-dialog__message">{{ message }}</p>
      </div>

      <div class="confirm-dialog__actions">
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-secondary"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          class="btn"
          :class="confirmButtonClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-vue-next';

interface Props {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  confirmText?: string;
  cancelText?: string;
}

interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  confirmText: 'Confirmer',
  cancelText: 'Annuler'
});

const emit = defineEmits<Emits>();

const iconComponent = computed(() => {
  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    danger: AlertCircle,
    success: CheckCircle
  };
  return iconMap[props.type];
});

const confirmButtonClass = computed(() => {
  const classMap = {
    info: 'btn-primary',
    warning: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-primary'
  };
  return classMap[props.type];
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  animation: fadeIn 200ms ease-out;
}

.confirm-dialog {
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 420px;
  animation: slideIn 200ms ease-out;
}

.confirm-dialog__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
}

.confirm-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  flex-shrink: 0;
}

.confirm-dialog__title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.confirm-dialog__content {
  padding: 0 var(--space-6) var(--space-6) var(--space-6);
}

.confirm-dialog__message {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.confirm-dialog__actions {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6) var(--space-6) var(--space-6);
  justify-content: flex-end;
}

.confirm-dialog--info .confirm-dialog__icon {
  background-color: var(--info);
  color: white;
}

.confirm-dialog--warning .confirm-dialog__icon {
  background-color: var(--warning);
  color: white;
}

.confirm-dialog--danger .confirm-dialog__icon {
  background-color: var(--error);
  color: white;
}

.confirm-dialog--success .confirm-dialog__icon {
  background-color: var(--success);
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 480px) {
  .modal-backdrop {
    padding: var(--space-2);
  }
  
  .confirm-dialog__header {
    padding: var(--space-4) var(--space-4) var(--space-3) var(--space-4);
  }
  
  .confirm-dialog__content {
    padding: 0 var(--space-4) var(--space-4) var(--space-4);
  }
  
  .confirm-dialog__actions {
    padding: var(--space-3) var(--space-4) var(--space-4) var(--space-4);
    flex-direction: column-reverse;
  }
  
  .confirm-dialog__actions .btn {
    width: 100%;
  }
}
</style>