import { ref } from 'vue';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    };

    toasts.value.push(newToast);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const showSuccess = (message: string, duration?: number) => {
    showToast({ type: 'success', message, duration });
  };

  const showError = (message: string, duration?: number) => {
    showToast({ type: 'error', message, duration });
  };

  const showWarning = (message: string, duration?: number) => {
    showToast({ type: 'warning', message, duration });
  };

  const showInfo = (message: string, duration?: number) => {
    showToast({ type: 'info', message, duration });
  };

  const clearToasts = () => {
    toasts.value = [];
  };

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearToasts
  };
}