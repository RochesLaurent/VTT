<template>
  <div class="stat-card" :class="`stat-card--${color}`">
    <div class="stat-card__icon">
      <component :is="iconComponent" class="w-6 h-6" />
    </div>
    <div class="stat-card__content">
      <div class="stat-card__value">{{ formattedValue }}</div>
      <div class="stat-card__title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Gamepad2,
  PlusCircle,
  Clock,
  MessageCircle,
  Dice6,
  UserPlus,
  Users,
  Target,
  TrendingUp,
  Award
} from 'lucide-vue-next';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'accent';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
});

const iconMap = {
  'gamepad-2': Gamepad2,
  'plus-circle': PlusCircle,
  'clock': Clock,
  'message-circle': MessageCircle,
  'dice-6': Dice6,
  'user-plus': UserPlus,
  'users': Users,
  'target': Target,
  'trending-up': TrendingUp,
  'award': Award
};

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || Target;
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value >= 1000000) {
      return `${(props.value / 1000000).toFixed(1)}M`;
    } else if (props.value >= 1000) {
      return `${(props.value / 1000).toFixed(1)}k`;
    }
    return props.value.toLocaleString('fr-FR');
  }
  return props.value;
});
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  flex-shrink: 0;
}

.stat-card__content {
  flex: 1;
  min-width: 0;
}

.stat-card__value {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-card__title {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

/* Color variants */
.stat-card--primary .stat-card__icon {
  background-color: var(--primary-500);
  color: white;
}

.stat-card--secondary .stat-card__icon {
  background-color: var(--secondary-600);
  color: white;
}

.stat-card--success .stat-card__icon {
  background-color: var(--success);
  color: white;
}

.stat-card--warning .stat-card__icon {
  background-color: var(--warning);
  color: white;
}

.stat-card--error .stat-card__icon {
  background-color: var(--error);
  color: white;
}

.stat-card--info .stat-card__icon {
  background-color: var(--info);
  color: white;
}

.stat-card--accent .stat-card__icon {
  background-color: var(--accent-purple);
  color: white;
}

@media (max-width: 768px) {
  .stat-card {
    padding: var(--space-3);
    gap: var(--space-3);
  }
  
  .stat-card__icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-card__value {
    font-size: var(--text-xl);
  }
}
</style>