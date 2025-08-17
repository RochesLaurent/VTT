<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-6">
      <div class="relative">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img
            v-if="localUser.avatar"
            :src="localUser.avatar"
            :alt="`Avatar de ${localUser.firstname}`"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <UserIcon class="w-12 h-12" />
          </div>
        </div>
        <button
          @click="triggerFileInput"
          class="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 text-white hover:bg-primary-600 transition-colors"
          title="Changer l'avatar"
        >
          <Camera class="w-4 h-4" />
        </button>
      </div>
      
      <div>
        <h3 class="text-lg font-medium text-gray-900">Photo de profil</h3>
        <p class="text-sm text-gray-500">JPG, PNG, GIF ou WebP. Max 5MB.</p>
        <div class="mt-2 space-x-2">
          <button
            @click="triggerFileInput"
            class="btn btn-sm btn-outline"
          >
            Changer
          </button>
          <button
            v-if="localUser.avatar"
            @click="$emit('avatar-delete')"
            class="btn btn-sm btn-outline btn-error"
          >
            Supprimer
          </button>
        </div>
      </div>
      
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        @change="handleFileChange"
        class="hidden"
      />
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            id="firstname"
            v-model="formData.firstname"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            :class="{ 'border-red-500': errors.firstname }"
          />
          <p v-if="errors.firstname" class="mt-1 text-sm text-red-600">{{ errors.firstname }}</p>
        </div>

        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            id="lastname"
            v-model="formData.lastname"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            :class="{ 'border-red-500': errors.lastname }"
          />
          <p v-if="errors.lastname" class="mt-1 text-sm text-red-600">{{ errors.lastname }}</p>
        </div>
      </div>

      <div>
        <label for="pseudo" class="block text-sm font-medium text-gray-700">
          Pseudo
          <span class="text-gray-400 text-xs ml-1">(Nom affiché en jeu)</span>
        </label>
        <input
          id="pseudo"
          v-model="formData.pseudo"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          :class="{ 'border-red-500': errors.pseudo }"
          @blur="checkPseudoAvailability"
        />
        <p v-if="errors.pseudo" class="mt-1 text-sm text-red-600">{{ errors.pseudo }}</p>
        <p v-if="pseudoStatus" :class="pseudoStatus.available ? 'text-green-600' : 'text-red-600'" class="mt-1 text-sm">
          {{ pseudoStatus.message }}
        </p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Adresse email
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          :class="{ 'border-red-500': errors.email }"
          @blur="checkEmailAvailability"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        <p v-if="emailStatus" :class="emailStatus.available ? 'text-green-600' : 'text-red-600'" class="mt-1 text-sm">
          {{ emailStatus.message }}
        </p>
      </div>

      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700">
          Bio
          <span class="text-gray-400 text-xs ml-1">(Optionnel - Max 500 caractères)</span>
        </label>
        <textarea
          id="bio"
          v-model="formData.bio"
          rows="4"
          maxlength="500"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          :class="{ 'border-red-500': errors.bio }"
          placeholder="Parlez-nous un peu de vous..."
        ></textarea>
        <div class="mt-1 text-sm text-gray-500 text-right">
          {{ formData.bio?.length || 0 }}/500
        </div>
        <p v-if="errors.bio" class="mt-1 text-sm text-red-600">{{ errors.bio }}</p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="resetForm"
          class="btn btn-outline"
          :disabled="!hasChanges || isSubmitting"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!hasChanges || isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-2"></span>
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { UserProfile, UserUpdateData } from '@/types/user.types';
import { UserService } from '@/services/user.service';
import { User as UserIcon, Camera } from 'lucide-vue-next';

const props = defineProps<{
  user: UserProfile | null;
}>();

const emit = defineEmits<{
  update: [data: UserUpdateData];
  'avatar-change': [file: File];
  'avatar-delete': [];
}>();

const localUser = ref<UserProfile>({...props.user!});
const formData = reactive<UserUpdateData>({
  email: props.user?.email || '',
  pseudo: props.user?.pseudo || '',
  firstname: props.user?.firstname || '',
  lastname: props.user?.lastname || '',
  bio: props.user?.bio || ''
});

const originalData = {...formData};
const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const emailStatus = ref<{ available: boolean; message: string } | null>(null);
const pseudoStatus = ref<{ available: boolean; message: string } | null>(null);

const hasChanges = computed(() => {
  return Object.keys(formData).some(key => {
    return formData[key as keyof UserUpdateData] !== originalData[key as keyof UserUpdateData];
  });
});

const isFormValid = computed(() => {
  return !Object.keys(errors).length && 
         formData.email && 
         formData.firstname && 
         formData.lastname && 
         formData.pseudo &&
         (!emailStatus.value || emailStatus.value.available) &&
         (!pseudoStatus.value || pseudoStatus.value.available);
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    localUser.value = {...newUser};
    Object.assign(formData, {
      email: newUser.email,
      pseudo: newUser.pseudo,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      bio: newUser.bio || ''
    });
    Object.assign(originalData, formData);
  }
});

const validateField = (field: keyof UserUpdateData, value: any) => {
  delete errors[field];
  
  switch (field) {
    case 'email':
      if (!value) {
        errors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Email invalide';
      }
      break;
    case 'firstname':
    case 'lastname':
      if (!value) {
        errors[field] = 'Ce champ est requis';
      } else if (value.length > 100) {
        errors[field] = 'Maximum 100 caractères';
      }
      break;
    case 'pseudo':
      if (!value) {
        errors.pseudo = 'Le pseudo est requis';
      } else if (value.length < 3) {
        errors.pseudo = 'Minimum 3 caractères';
      } else if (value.length > 250) {
        errors.pseudo = 'Maximum 250 caractères';
      }
      break;
    case 'bio':
      if (value && value.length > 500) {
        errors.bio = 'Maximum 500 caractères';
      }
      break;
  }
};

const checkEmailAvailability = debounce(async () => {
  if (formData.email && formData.email !== originalData.email) {
    try {
      const available = await UserService.checkEmailAvailability(formData.email);
      emailStatus.value = {
        available,
        message: available ? 'Email disponible' : 'Cet email est déjà utilisé'
      };
    } catch (error) {
      emailStatus.value = null;
    }
  } else {
    emailStatus.value = null;
  }
}, 500);

const checkPseudoAvailability = debounce(async () => {
  if (formData.pseudo && formData.pseudo !== originalData.pseudo) {
    try {
      pseudoStatus.value = {
        available: true,
        message: 'Pseudo disponible'
      };
    } catch (error) {
      pseudoStatus.value = null;
    }
  } else {
    pseudoStatus.value = null;
  }
}, 500);

const handleSubmit = async () => {
  Object.keys(formData).forEach(key => {
    validateField(key as keyof UserUpdateData, formData[key as keyof UserUpdateData]);
  });
  
  if (!isFormValid.value) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const changes: UserUpdateData = {};
    Object.keys(formData).forEach(key => {
      const typedKey = key as keyof UserUpdateData;
      if (formData[typedKey] !== originalData[typedKey]) {
        changes[typedKey] = formData[typedKey];
      }
    });
    
    emit('update', changes);
    Object.assign(originalData, formData);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, originalData);
  Object.keys(errors).forEach(key => delete errors[key]);
  emailStatus.value = null;
  pseudoStatus.value = null;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const validation = UserService.validateAvatarFile(file);
    if (validation.valid) {
      emit('avatar-change', file);
    } else {
      alert(validation.error);
    }
    
    input.value = '';
  }
};

Object.keys(formData).forEach(key => {
  watch(() => formData[key as keyof UserUpdateData], (value) => {
    validateField(key as keyof UserUpdateData, value);
  });
});
</script>