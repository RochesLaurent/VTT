<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    @click="toggle"
    class="toggle-switch"
    :class="{ 'toggle-switch--active': modelValue }"
    :disabled="disabled"
  >
    <span 
      class="toggle-switch__thumb"
      :class="{ 'toggle-switch__thumb--active': modelValue }"
    ></span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<Emits>();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: var(--secondary-600);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--transition-normal);
  outline: none;
}

.toggle-switch:focus {
  box-shadow: var(--shadow-focus-primary);
}

.toggle-switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-switch--active {
  background-color: var(--primary-500);
  border-color: var(--primary-500);
}

.toggle-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: transform var(--transition-normal);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-switch__thumb--active {
  transform: translateX(20px);
}

.toggle-switch:hover:not(:disabled) {
  transform: scale(1.05);
}

.toggle-switch:active:not(:disabled) {
  transform: scale(0.95);
}
</style>