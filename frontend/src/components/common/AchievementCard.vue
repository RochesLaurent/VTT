<template>
  <div class="achievement-card" :class="`achievement-card--${achievement.rarity}`">
    <div class="achievement-card__icon">
      <component :is="iconComponent" class="w-6 h-6" />
    </div>
    
    <div class="achievement-card__content">
      <div class="achievement-card__header">
        <h4 class="achievement-card__name">{{ achievement.name }}</h4>
        <span class="achievement-card__rarity">{{ rarityLabel }}</span>
      </div>
      
      <p class="achievement-card__description">{{ achievement.description }}</p>
      
      <div class="achievement-card__footer">
        <span class="achievement-card__date">
          Débloqué {{ formatDate(achievement.unlockedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Trophy,
  Crown,
  Star,
  Shield,
  Sword,
  UserPlus,
  Zap,
  Target,
  Award,
  Medal
} from 'lucide-vue-next';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Props {
  achievement: Achievement;
}

const props = defineProps<Props>();

const iconMap = {
  'trophy': Trophy,
  'crown': Crown,
  'star': Star,
  'shield': Shield,
  'sword': Sword,
  'user-plus': UserPlus,
  'zap': Zap,
  'target': Target,
  'award': Award,
  'medal': Medal
};

const iconComponent = computed(() => {
  return iconMap[props.achievement.icon as keyof typeof iconMap] || Trophy;
});

const rarityLabel = computed(() => {
  const labels = {
    common: 'Commun',
    rare: 'Rare',
    epic: 'Épique',
    legendary: 'Légendaire'
  };
  return labels[props.achievement.rarity];
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'aujourd\'hui';
  } else if (diffInDays === 1) {
    return 'hier';
  } else if (diffInDays < 7) {
    return `il y a ${diffInDays} jours`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
};
</script>

<style scoped>
.achievement-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.achievement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: all var(--transition-normal);
}

.achievement-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.achievement-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  flex-shrink: 0;
  color: white;
}

.achievement-card__content {
  flex: 1;
  min-width: 0;
}

.achievement-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.achievement-card__name {
  font-size: var(--text-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.achievement-card__rarity {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.achievement-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--space-3) 0;
}

.achievement-card__footer {
  display: flex;
  justify-content: flex-end;
}

.achievement-card__date {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
}

.achievement-card--common::before {
  background: linear-gradient(90deg, var(--secondary-400), var(--secondary-500));
}

.achievement-card--common .achievement-card__icon {
  background-color: var(--secondary-500);
}

.achievement-card--common .achievement-card__rarity {
  background-color: var(--secondary-500);
  color: white;
}

.achievement-card--rare::before {
  background: linear-gradient(90deg, var(--info), #60a5fa);
}

.achievement-card--rare .achievement-card__icon {
  background-color: var(--info);
}

.achievement-card--rare .achievement-card__rarity {
  background-color: var(--info);
  color: white;
}

.achievement-card--epic::before {
  background: linear-gradient(90deg, var(--accent-purple), #a855f7);
}

.achievement-card--epic .achievement-card__icon {
  background-color: var(--accent-purple);
}

.achievement-card--epic .achievement-card__rarity {
  background-color: var(--accent-purple);
  color: white;
}

.achievement-card--legendary::before {
  background: linear-gradient(90deg, var(--accent-amber), #f59e0b);
}

.achievement-card--legendary .achievement-card__icon {
  background-color: var(--accent-amber);
}

.achievement-card--legendary .achievement-card__rarity {
  background-color: var(--accent-amber);
  color: white;
}

@media (max-width: 768px) {
  .achievement-card {
    padding: var(--space-3);
    gap: var(--space-2);
  }
  
  .achievement-card__icon {
    width: 40px;
    height: 40px;
  }
  
  .achievement-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }
}
</style>