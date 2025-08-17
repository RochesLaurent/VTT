<template>
  <div class="space-y-8">
    <div class="border-b pb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
      
      <form @submit.prevent="handlePasswordChange" class="space-y-4 max-w-lg">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <div class="mt-1 relative">
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
              :class="{ 'border-red-500': passwordErrors.currentPassword }"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <component :is="showCurrentPassword ? EyeOff : Eye" class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">
            {{ passwordErrors.currentPassword }}
          </p>
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <div class="mt-1 relative">
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
              :class="{ 'border-red-500': passwordErrors.newPassword }"
              @input="validatePassword"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <component :is="showNewPassword ? EyeOff : Eye" class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">
            {{ passwordErrors.newPassword }}
          </p>
          
          <div v-if="passwordForm.newPassword" class="mt-2">
            <div class="flex items-center space-x-2">
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="passwordStrengthClass"
                  :style="{ width: `${passwordStrength}%` }"
                ></div>
              </div>
              <span class="text-sm text-gray-600">{{ passwordStrengthText }}</span>
            </div>
            <ul class="mt-2 text-xs text-gray-600 space-y-1">
              <li :class="{ 'text-green-600': passwordChecks.minLength }">
                <component :is="passwordChecks.minLength ? CheckCircle : XCircle" class="inline h-3 w-3 mr-1" />
                Au moins 8 caractères
              </li>
              <li :class="{ 'text-green-600': passwordChecks.hasUpperCase }">
                <component :is="passwordChecks.hasUpperCase ? CheckCircle : XCircle" class="inline h-3 w-3 mr-1" />
                Une lettre majuscule
              </li>
              <li :class="{ 'text-green-600': passwordChecks.hasLowerCase }">
                <component :is="passwordChecks.hasLowerCase ? CheckCircle : XCircle" class="inline h-3 w-3 mr-1" />
                Une lettre minuscule
              </li>
              <li :class="{ 'text-green-600': passwordChecks.hasNumber }">
                <component :is="passwordChecks.hasNumber ? CheckCircle : XCircle" class="inline h-3 w-3 mr-1" />
                Un chiffre
              </li>
              <li :class="{ 'text-green-600': passwordChecks.hasSpecial }">
                <component :is="passwordChecks.hasSpecial ? CheckCircle : XCircle" class="inline h-3 w-3 mr-1" />
                Un caractère spécial
              </li>
            </ul>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <div class="mt-1 relative">
            <input
              id="confirmPassword"
              v-model="passwordForm.newPasswordConfirm"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
              :class="{ 'border-red-500': passwordErrors.newPasswordConfirm }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <component :is="showConfirmPassword ? EyeOff : Eye" class="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <p v-if="passwordErrors.newPasswordConfirm" class="mt-1 text-sm text-red-600">
            {{ passwordErrors.newPasswordConfirm }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isChangingPassword || !isPasswordFormValid"
          >
            <span v-if="isChangingPassword" class="loading loading-spinner loading-sm mr-2"></span>
            {{ isChangingPassword ? 'Modification...' : 'Modifier le mot de passe' }}
          </button>
        </div>
      </form>
    </div>

    <div class="border-b pb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Authentification à deux facteurs</h3>
      <p class="text-gray-600 mb-4">
        Ajoutez une couche de sécurité supplémentaire à votre compte.
      </p>
      <button class="btn btn-outline" disabled>
        <Shield class="w-4 h-4 mr-2" />
        Bientôt disponible
      </button>
    </div>

    <div class="border-b pb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Sessions actives</h3>
      <p class="text-gray-600 mb-4">
        Gérez et déconnectez vos sessions actives sur d'autres appareils.
      </p>
      <button class="btn btn-outline" disabled>
        <Monitor class="w-4 h-4 mr-2" />
        Bientôt disponible
      </button>
    </div>

    <div>
      <h3 class="text-lg font-medium text-red-600 mb-4">Zone dangereuse</h3>
      
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-red-800 mb-2">Supprimer le compte</h4>
        <p class="text-sm text-red-700 mb-4">
          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
        </p>
        
        <button
          @click="showDeleteModal = true"
          class="btn btn-sm btn-error"
        >
          <Trash2 class="w-4 h-4 mr-2" />
          Supprimer mon compte
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="showDeleteModal = false"></div>

          <div class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <AlertTriangle class="w-6 h-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Supprimer votre compte
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.
                  </p>
                </div>
                <div class="mt-4">
                  <label for="deletePassword" class="block text-sm font-medium text-gray-700 text-left">
                    Entrez votre mot de passe pour confirmer
                  </label>
                  <input
                    id="deletePassword"
                    v-model="deletePassword"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    placeholder="Mot de passe"
                  />
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                @click="handleDeleteAccount"
                :disabled="!deletePassword || isDeletingAccount"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isDeletingAccount" class="loading loading-spinner loading-sm mr-2"></span>
                {{ isDeletingAccount ? 'Suppression...' : 'Supprimer définitivement' }}
              </button>
              <button
                @click="showDeleteModal = false"
                class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { PasswordChangeData } from '@/types/user.types';
import { Eye, EyeOff, Shield, Monitor, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  'password-change': [data: PasswordChangeData];
  'delete-account': [password: string];
}>();

const passwordForm = reactive<PasswordChangeData>({
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
});

const passwordErrors = reactive<Record<string, string>>({});
const isChangingPassword = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordChecks = reactive({
  minLength: false,
  hasUpperCase: false,
  hasLowerCase: false,
  hasNumber: false,
  hasSpecial: false
});

const passwordStrength = computed(() => {
  const checks = Object.values(passwordChecks);
  const passed = checks.filter(Boolean).length;
  return (passed / checks.length) * 100;
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 20) return 'bg-red-500';
  if (passwordStrength.value <= 40) return 'bg-orange-500';
  if (passwordStrength.value <= 60) return 'bg-yellow-500';
  if (passwordStrength.value <= 80) return 'bg-blue-500';
  return 'bg-green-500';
});

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 20) return 'Très faible';
  if (passwordStrength.value <= 40) return 'Faible';
  if (passwordStrength.value <= 60) return 'Moyen';
  if (passwordStrength.value <= 80) return 'Fort';
  return 'Très fort';
});

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword &&
         passwordForm.newPassword &&
         passwordForm.newPasswordConfirm &&
         passwordForm.newPassword === passwordForm.newPasswordConfirm &&
         passwordStrength.value >= 60;
});

const showDeleteModal = ref(false);
const deletePassword = ref('');
const isDeletingAccount = ref(false);

const validatePassword = () => {
  const password = passwordForm.newPassword;
  
  passwordChecks.minLength = password.length >= 8;
  passwordChecks.hasUpperCase = /[A-Z]/.test(password);
  passwordChecks.hasLowerCase = /[a-z]/.test(password);
  passwordChecks.hasNumber = /\d/.test(password);
  passwordChecks.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  delete passwordErrors.newPassword;
  
  if (passwordForm.newPasswordConfirm && passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
    passwordErrors.newPasswordConfirm = 'Les mots de passe ne correspondent pas';
  } else {
    delete passwordErrors.newPasswordConfirm;
  }
};

const handlePasswordChange = () => {
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Le mot de passe actuel est requis';
    return;
  }
  
  if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
    passwordErrors.newPasswordConfirm = 'Les mots de passe ne correspondent pas';
    return;
  }
  
  isChangingPassword.value = true;
  emit('password-change', passwordForm);
  
  setTimeout(() => {
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.newPasswordConfirm = '';
    isChangingPassword.value = false;
  }, 1000);
};

const handleDeleteAccount = () => {
  if (!deletePassword.value) return;
  
  isDeletingAccount.value = true;
  emit('delete-account', deletePassword.value);
};
</script>