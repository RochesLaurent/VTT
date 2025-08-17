<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold text-text-primary mb-4">Apparence</h3>
      
      <div class="space-y-4">
        <div>
          <label class="label">Thème</label>
          <div class="grid grid-cols-3 gap-3">
            <label 
              v-for="theme in themeOptions"
              :key="theme.value"
              class="relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all"
              :class="form.theme === theme.value 
                ? 'border-primary-500 bg-primary-500 bg-opacity-10' 
                : 'border-border-primary hover:border-primary-400'"
            >
              <input
                v-model="form.theme"
                type="radio"
                :value="theme.value"
                class="sr-only"
              />
              <div class="text-center">
                <component :is="theme.icon" class="w-6 h-6 mx-auto mb-2" />
                <div class="text-sm font-medium">{{ theme.label }}</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label class="label">Langue</label>
          <select v-model="form.language" class="input">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>

    <div class="border-t border-border-primary pt-8">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Notifications</h3>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Notifications par email</div>
            <div class="text-xs text-text-muted">Recevoir des emails de notification</div>
          </div>
          <ToggleSwitch v-model="form.notifications.email" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Notifications push</div>
            <div class="text-xs text-text-muted">Notifications dans le navigateur</div>
          </div>
          <ToggleSwitch v-model="form.notifications.push" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Invitations de partie</div>
            <div class="text-xs text-text-muted">Être notifié des invitations</div>
          </div>
          <ToggleSwitch v-model="form.notifications.gameInvites" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Mises à jour de partie</div>
            <div class="text-xs text-text-muted">Rappels et mises à jour importantes</div>
          </div>
          <ToggleSwitch v-model="form.notifications.updates" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Nouveaux messages</div>
            <div class="text-xs text-text-muted">Messages dans le chat de partie</div>
          </div>
          <ToggleSwitch v-model="form.notifications.messages" />
        </div>
      </div>
    </div>

    <div class="border-t border-border-primary pt-8">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Préférences de jeu</h3>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Lancer automatique des dés</div>
            <div class="text-xs text-text-muted">Lancer les dés automatiquement lors des actions</div>
          </div>
          <ToggleSwitch v-model="form.game.autoRoll" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Animation des dés</div>
            <div class="text-xs text-text-muted">Afficher les animations de lancer de dés</div>
          </div>
          <ToggleSwitch v-model="form.game.showDiceAnimation" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Effets sonores</div>
            <div class="text-xs text-text-muted">Sons pour les dés et notifications</div>
          </div>
          <ToggleSwitch v-model="form.game.soundEffects" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Taille de la grille</div>
            <div class="text-xs text-text-muted">Taille par défaut de la grille de carte</div>
          </div>
          <select v-model="form.game.gridSize" class="input input-sm">
            <option value="small">Petite</option>
            <option value="medium">Moyenne</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
    </div>

    <div class="border-t border-border-primary pt-8">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Confidentialité</h3>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Afficher votre email</div>
            <div class="text-xs text-text-muted">Rendre votre email visible aux autres joueurs</div>
          </div>
          <ToggleSwitch v-model="form.privacy.showEmail" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Afficher votre nom réel</div>
            <div class="text-xs text-text-muted">Afficher vos nom et prénom sur votre profil</div>
          </div>
          <ToggleSwitch v-model="form.privacy.showRealName" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-text-primary">Autoriser les invitations</div>
            <div class="text-xs text-text-muted">Permettre aux autres de vous inviter dans leurs parties</div>
          </div>
          <ToggleSwitch v-model="form.privacy.allowInvites" />
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-border-primary">
      <button
        type="button"
        @click="resetForm"
        class="btn btn-secondary"
        :disabled="isLoading"
      >
        Annuler
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isLoading || !hasChanges"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        Enregistrer les préférences
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { UserPreferences } from '@/types/user.types';
import { Sun, Moon, Monitor, Save, Loader2 } from 'lucide-vue-next';

import ToggleSwitch from '@/components/common/ToggleSwitch.vue';

interface Props {
  preferences: UserPreferences;
}

interface Emits {
  (e: 'update', preferences: UserPreferences): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isLoading = ref(false);

const themeOptions = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
  { value: 'system', label: 'Système', icon: Monitor }
];

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'fr',
  notifications: {
    email: true,
    push: true,
    gameInvites: true,
    updates: true,
    messages: true
  },
  game: {
    autoRoll: false,
    showDiceAnimation: true,
    soundEffects: true,
    gridSize: 'medium'
  },
  privacy: {
    showEmail: false,
    showRealName: true,
    allowInvites: true
  }
};

const form = ref<UserPreferences>({ ...defaultPreferences });
const originalForm = ref<UserPreferences>({ ...defaultPreferences });

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

const initForm = () => {
  const preferences = { ...defaultPreferences, ...props.preferences };
  form.value = JSON.parse(JSON.stringify(preferences));
  originalForm.value = JSON.parse(JSON.stringify(preferences));
};

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(originalForm.value));
};

const handleSubmit = async () => {
  isLoading.value = true;
  
  try {
    emit('update', JSON.parse(JSON.stringify(form.value)));
    originalForm.value = JSON.parse(JSON.stringify(form.value));
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.preferences, initForm, { deep: true });

onMounted(() => {
  initForm();
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>