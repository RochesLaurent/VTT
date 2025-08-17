<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p class="text-gray-600 mt-2">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-6 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 inline-block mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>

        <div v-else-if="error" class="alert alert-error">
          <AlertCircle class="w-5 h-5" />
          <span>{{ error }}</span>
        </div>

        <div v-else>
          <div v-if="activeTab === 'general'" class="space-y-6">
            <ProfileForm
              :user="userProfile"
              @update="handleProfileUpdate"
              @avatar-change="handleAvatarChange"
              @avatar-delete="handleAvatarDelete"
            />
          </div>

          <div v-if="activeTab === 'security'" class="space-y-6">
            <SecuritySettings
              @password-change="handlePasswordChange"
              @delete-account="handleAccountDeletion"
            />
          </div>

          <div v-if="activeTab === 'preferences'" class="space-y-6">
            <PreferencesForm
              :preferences="userProfile?.preferences || {}"
              @update="handlePreferencesUpdate"
            />
          </div>

          <div v-if="activeTab === 'stats'" class="space-y-6">
            <UserStatistics :user="userProfile" />
          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-if="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :type="confirmDialog.type"
      @confirm="confirmDialog.onConfirm"
      @cancel="closeConfirmDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { UserService } from '@/services/user.service';
import { useToast } from '@/composables/useToast';
import type { UserProfile, UserUpdateData, PasswordChangeData, UserPreferences } from '@/types/user.types';

import ProfileForm from '@/components/profile/ProfileForm.vue';
import SecuritySettings from '@/components/profile/SecuritySettings.vue';
import PreferencesForm from '@/components/profile/PreferencesForm.vue';
import UserStatistics from '@/components/profile/UserStatistics.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

import { User, Shield, Settings, BarChart3, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const { showSuccess, showError } = useToast();

const activeTab = ref('general');
const isLoading = ref(false);
const error = ref<string | null>(null);
const userProfile = ref<UserProfile | null>(null);
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '',
  message: '',
  type: 'warning' as 'warning' | 'danger',
  onConfirm: () => {}
});

const tabs = [
  { id: 'general', label: 'Informations générales', icon: User },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'preferences', label: 'Préférences', icon: Settings },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 }
];

const loadProfile = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    userProfile.value = await UserService.getProfile();
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du profil';
    showError(error.value);
  } finally {
    isLoading.value = false;
  }
};

const handleProfileUpdate = async (data: UserUpdateData) => {
  isLoading.value = true;
  
  try {
    const updatedProfile = await UserService.updateProfile(data);
    userProfile.value = updatedProfile;
    
    authStore.updateProfile({
      email: updatedProfile.email,
      username: updatedProfile.username,
      pseudo: updatedProfile.pseudo,
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname
    });
    
    showSuccess('Profil mis à jour avec succès');
  } catch (err: any) {
    showError(err.message || 'Erreur lors de la mise à jour du profil');
  } finally {
    isLoading.value = false;
  }
};

const handleAvatarChange = async (file: File) => {
  const validation = UserService.validateAvatarFile(file);
  if (!validation.valid) {
    showError(validation.error!);
    return;
  }
  
  isLoading.value = true;
  
  try {
    const avatarUrl = await UserService.uploadAvatar(file);
    if (userProfile.value) {
      userProfile.value.avatar = avatarUrl;
    }
    showSuccess('Avatar mis à jour avec succès');
  } catch (err: any) {
    showError(err.message || 'Erreur lors du téléchargement de l\'avatar');
  } finally {
    isLoading.value = false;
  }
};

const handleAvatarDelete = async () => {
  confirmDialog.value = {
    title: 'Supprimer l\'avatar',
    message: 'Êtes-vous sûr de vouloir supprimer votre avatar ?',
    type: 'warning',
    onConfirm: async () => {
      closeConfirmDialog();
      isLoading.value = true;
      
      try {
        await UserService.deleteAvatar();
        if (userProfile.value) {
          userProfile.value.avatar = null;
        }
        showSuccess('Avatar supprimé avec succès');
      } catch (err: any) {
        showError(err.message || 'Erreur lors de la suppression de l\'avatar');
      } finally {
        isLoading.value = false;
      }
    }
  };
  showConfirmDialog.value = true;
};

const handlePasswordChange = async (data: PasswordChangeData) => {
  isLoading.value = true;
  
  try {
    await UserService.changePassword(data);
    showSuccess('Mot de passe modifié avec succès');
  } catch (err: any) {
    showError(err.message || 'Erreur lors du changement de mot de passe');
  } finally {
    isLoading.value = false;
  }
};

const handlePreferencesUpdate = async (preferences: UserPreferences) => {
  isLoading.value = true;
  
  try {
    const updatedPreferences = await UserService.updatePreferences(preferences);
    if (userProfile.value) {
      userProfile.value.preferences = updatedPreferences;
    }
    showSuccess('Préférences mises à jour avec succès');
  } catch (err: any) {
    showError(err.message || 'Erreur lors de la mise à jour des préférences');
  } finally {
    isLoading.value = false;
  }
};

const handleAccountDeletion = async (password: string | null) => {
  if (!password || password.trim() === '') {
    showError('Le mot de passe est requis pour confirmer la suppression');
    return;
  }

  const validPassword = password.trim();

  confirmDialog.value = {
    title: 'Supprimer le compte',
    message: 'Cette action est irréversible. Toutes vos données seront définitivement supprimées. Êtes-vous sûr de vouloir continuer ?',
    type: 'danger',
    onConfirm: async () => {
      closeConfirmDialog();
      isLoading.value = true;
      
      try {
        await UserService.deleteAccount(validPassword);
        showSuccess('Compte supprimé avec succès');
        await authStore.logout();
        router.push('/');
      } catch (err: any) {
        showError(err.message || 'Erreur lors de la suppression du compte');
      } finally {
        isLoading.value = false;
      }
    }
  };
  showConfirmDialog.value = true;
};

const closeConfirmDialog = () => {
  showConfirmDialog.value = false;
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
</style>