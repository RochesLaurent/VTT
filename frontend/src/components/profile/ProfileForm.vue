<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Avatar Section -->
    <div class="flex items-center space-x-6">
      <div class="relative">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-secondary-700 border-2 border-border-primary">
          <img 
            v-if="avatarPreview || user?.avatar" 
            :src="avatarPreview || user?.avatar" 
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <User class="w-8 h-8 text-text-muted" />
          </div>
        </div>
        
        <!-- Upload Button Overlay -->
        <label class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <Camera class="w-6 h-6 text-white" />
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            @change="handleAvatarChange"
            class="hidden"
          />
        </label>
      </div>
      
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-text-primary mb-2">Photo de profil</h3>
        <p class="text-sm text-text-muted mb-3">JPG, PNG ou WebP. 5MB max.</p>
        <div class="flex space-x-3">
          <button
            type="button"
            @click="triggerAvatarUpload"
            class="btn btn-secondary btn-sm"
          >
            <Upload class="w-4 h-4" />
            Changer
          </button>
          <button
            v-if="user?.avatar"
            type="button"
            @click="$emit('avatar-delete')"
            class="btn btn-ghost btn-sm text-error hover:bg-error hover:bg-opacity-10"
          >
            <Trash2 class="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="label label-required">Pseudo</label>
        <input
          v-model="form.pseudo"
          type="text"
          class="input"
          :class="{ 'input-error': errors.pseudo }"
          placeholder="Votre pseudo"
          required
        />
        <div v-if="errors.pseudo" class="error-text">{{ errors.pseudo }}</div>
      </div>

      <div>
        <label class="label label-required">Nom d'utilisateur</label>
        <input
          v-model="form.username"
          type="text"
          class="input"
          :class="{ 'input-error': errors.username }"
          placeholder="nom_utilisateur"
          required
        />
        <div v-if="errors.username" class="error-text">{{ errors.username }}</div>
        <div class="helper-text">Utilisé pour se connecter et dans l'URL de profil</div>
      </div>

      <div>
        <label class="label">Prénom</label>
        <input
          v-model="form.firstname"
          type="text"
          class="input"
          placeholder="Prénom"
        />
      </div>

      <div>
        <label class="label">Nom</label>
        <input
          v-model="form.lastname"
          type="text"
          class="input"
          placeholder="Nom de famille"
        />
      </div>

      <div class="md:col-span-2">
        <label class="label label-required">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="input"
          :class="{ 'input-error': errors.email }"
          placeholder="votre@email.com"
          required
        />
        <div v-if="errors.email" class="error-text">{{ errors.email }}</div>
      </div>
    </div>

    <!-- Account Information -->
    <div class="border-t border-border-primary pt-6">
      <h3 class="text-lg font-semibold text-text-primary mb-4">Informations du compte</h3>
      
      <div class="bg-bg-secondary rounded-lg p-4 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Membre depuis</span>
          <span class="text-sm text-text-primary">{{ formatDate(user?.createdAt) }}</span>
        </div>
        <div v-if="user?.updatedAt" class="flex justify-between items-center">
          <span class="text-sm text-text-secondary">Dernière modification</span>
          <span class="text-sm text-text-primary">{{ formatDate(user.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
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
        Enregistrer
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { UserProfile, UserUpdateData } from '@/types/user.types';
import { UserService } from '@/services/user.service';

import { User, Camera, Upload, Trash2, Save, Loader2 } from 'lucide-vue-next';

interface Props {
  user: UserProfile | null;
}

interface Emits {
  (e: 'update', data: UserUpdateData): void;
  (e: 'avatar-change', file: File): void;
  (e: 'avatar-delete'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isLoading = ref(false);
const avatarInput = ref<HTMLInputElement>();
const avatarPreview = ref<string | null>(null);

const form = ref<UserUpdateData>({
  email: '',
  username: '',
  pseudo: '',
  firstname: '',
  lastname: ''
});

const originalForm = ref<UserUpdateData>({});

const errors = ref<Record<string, string>>({});

const hasChanges = computed(() => {
  return Object.keys(form.value).some(key => {
    const formKey = key as keyof UserUpdateData;
    return form.value[formKey] !== originalForm.value[formKey];
  });
});

const initForm = () => {
  if (props.user) {
    const userData = {
      email: props.user.email,
      username: props.user.username,
      pseudo: props.user.pseudo,
      firstname: props.user.firstname || '',
      lastname: props.user.lastname || ''
    };
    
    form.value = { ...userData };
    originalForm.value = { ...userData };
  }
};

const resetForm = () => {
  form.value = { ...originalForm.value };
  avatarPreview.value = null;
  errors.value = {};
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.pseudo?.trim()) {
    errors.value.pseudo = 'Le pseudo est requis';
  }

  if (!form.value.username?.trim()) {
    errors.value.username = 'Le nom d\'utilisateur est requis';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(form.value.username)) {
    errors.value.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores';
  }

  if (!form.value.email?.trim()) {
    errors.value.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format d\'email invalide';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  
  try {
    const updateData: UserUpdateData = {};
    
    // Only include changed fields
    Object.keys(form.value).forEach(key => {
      const formKey = key as keyof UserUpdateData;
      if (form.value[formKey] !== originalForm.value[formKey]) {
        updateData[formKey] = form.value[formKey];
      }
    });

    if (Object.keys(updateData).length > 0) {
      emit('update', updateData);
    }
  } finally {
    isLoading.value = false;
  }
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  const validation = UserService.validateAvatarFile(file);
  if (!validation.valid) {
    errors.value.avatar = validation.error!;
    return;
  }

  try {
    avatarPreview.value = await UserService.createFilePreview(file);
    emit('avatar-change', file);
    errors.value.avatar = '';
  } catch (error) {
    errors.value.avatar = 'Erreur lors de la prévisualisation de l\'image';
  }
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

watch(() => props.user, initForm, { immediate: true });

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
</style>