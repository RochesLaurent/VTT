<template>
  <div v-if="user" class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-text-primary mb-4">Aperçu général</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Parties jouées"
          :value="statistics?.gamesPlayed || 0"
          icon="gamepad-2"
          color="primary"
        />
        <StatCard
          title="Parties créées"
          :value="statistics?.gamesCreated || 0"
          icon="plus-circle"
          color="success"
        />
        <StatCard
          title="Heures de jeu"
          :value="formatHours(statistics?.hoursPlayed || 0)"
          icon="clock"
          color="warning"
        />
        <StatCard
          title="Messages envoyés"
          :value="statistics?.messagesPosted || 0"
          icon="message-circle"
          color="info"
        />
      </div>
    </div>

    <div class="border-t border-border-primary pt-6">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Activité</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Dés lancés"
          :value="statistics?.diceRolled || 0"
          icon="dice-6"
          color="accent"
        />
        <StatCard
          title="Personnages créés"
          :value="statistics?.charactersCreated || 0"
          icon="user-plus"
          color="secondary"
        />
      </div>
    </div>

    <div v-if="statistics?.mostPlayedCharacter" class="border-t border-border-primary pt-6">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Personnage favori</h3>
      
      <div class="bg-bg-secondary rounded-lg p-4">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <User class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="text-lg font-semibold text-text-primary">
              {{ statistics.mostPlayedCharacter.name }}
            </div>
            <div class="text-sm text-text-secondary">
              {{ statistics.mostPlayedCharacter.class }} - Niveau {{ statistics.mostPlayedCharacter.level }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-border-primary pt-6">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Informations du compte</h3>
      
      <div class="bg-bg-secondary rounded-lg p-4 space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Membre depuis</span>
          <span class="text-sm text-text-primary">{{ formatDate(user.createdAt) }}</span>
        </div>
        
        <div v-if="statistics?.lastActivity" class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Dernière activité</span>
          <span class="text-sm text-text-primary">{{ formatRelativeDate(statistics.lastActivity) }}</span>
        </div>
        
        <div v-if="statistics?.favoriteSystem" class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Système favori</span>
          <span class="text-sm text-text-primary">{{ statistics.favoriteSystem }}</span>
        </div>
      </div>
    </div>

    <div class="border-t border-border-primary pt-6">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Succès</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AchievementCard
          v-for="achievement in achievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>
      
      <div v-if="achievements.length === 0" class="text-center py-8">
        <Trophy class="w-12 h-12 text-text-muted mx-auto mb-2" />
        <p class="text-text-muted">Aucun succès débloqué pour l'instant</p>
        <p class="text-sm text-text-muted mt-1">Jouez davantage pour débloquer des succès !</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { UserProfile, UserStatistics } from '@/types/user.types';
import { UserService } from '@/services/user.service';

import { 
  User, 
  Trophy,
  Gamepad2,
  PlusCircle,
  Clock,
  MessageCircle,
  Dice6,
  UserPlus
} from 'lucide-vue-next';

import StatCard from '@/components/common/StatCard.vue';
import AchievementCard from '@/components/common/AchievementCard.vue';

interface Props {
  user: UserProfile | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const props = defineProps<Props>();

const statistics = ref<UserStatistics | null>(null);
const isLoading = ref(false);

const achievements = ref<Achievement[]>([
  {
    id: '1',
    name: 'Premier pas',
    description: 'Créer votre premier personnage',
    icon: 'user-plus',
    unlockedAt: '2024-01-15T10:00:00Z',
    rarity: 'common'
  },
  {
    id: '2',
    name: 'Maître du jeu',
    description: 'Créer votre première partie en tant que MJ',
    icon: 'crown',
    unlockedAt: '2024-02-01T14:30:00Z',
    rarity: 'rare'
  }
]);

const loadStatistics = async () => {
  if (!props.user) return;
  
  isLoading.value = true;
  
  try {
    statistics.value = await UserService.getStatistics();
  } catch (error) {
    console.error('Failed to load statistics:', error);
    statistics.value = {
      gamesPlayed: 12,
      gamesCreated: 3,
      hoursPlayed: 48.5,
      messagesPosted: 234,
      diceRolled: 1567,
      charactersCreated: 5,
      joinedAt: props.user.createdAt,
      lastActivity: new Date().toISOString(),
      favoriteSystem: 'D&D 5e',
      mostPlayedCharacter: {
        name: 'Elara Nightwhisper',
        class: 'Rôdeur Elfe',
        level: 8
      }
    };
  } finally {
    isLoading.value = false;
  }
};

const formatHours = (hours: number): string => {
  if (hours < 1) {
    return '< 1h';
  }
  return `${Math.round(hours)}h`;
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Aujourd\'hui';
  } else if (diffInDays === 1) {
    return 'Hier';
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else {
    return formatDate(dateString);
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
</style>