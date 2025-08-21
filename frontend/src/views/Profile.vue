<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header avec navigation -->
    <header class="bg-gray-800 border-b border-gray-700">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <h1 class="text-xl font-bold text-white">Projet J</h1>
            <nav class="hidden md:flex items-center gap-6">
              <router-link to="/dashboard" class="text-gray-300 hover:text-white transition">
                Tableau de bord
              </router-link>
              <router-link to="/games" class="text-gray-300 hover:text-white transition">
                Parties
              </router-link>
              <router-link to="/profile" class="text-primary-400 font-medium">
                Profil
              </router-link>
            </nav>
          </div>
          <button @click="handleLogout" class="btn btn-ghost btn-sm">
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Titre de la page -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Mon Profil</h2>
          <p class="text-gray-400">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <!-- Alertes -->
        <Transition name="fade" mode="out-in">
          <div v-if="successMessage" class="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div class="flex items-center gap-3 text-green-400">
              <CheckCircle class="w-5 h-5" />
              <span>{{ successMessage }}</span>
            </div>
          </div>
        </Transition>

        <Transition name="fade" mode="out-in">
          <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div class="flex items-center gap-3 text-red-400">
              <AlertCircle class="w-5 h-5" />
              <span>{{ error }}</span>
            </div>
          </div>
        </Transition>

        <!-- Section Avatar et informations de base -->
        <div class="card mb-6">
          <div class="flex flex-col sm:flex-row gap-6">
            <!-- Avatar -->
            <div class="flex flex-col items-center">
              <div class="relative group">
                <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600">
                  <img 
                    v-if="avatarUrl" 
                    :src="avatarUrl" 
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <User class="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <button
                  @click="triggerFileInput"
                  class="absolute inset-0 w-full h-full rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  :disabled="isLoading"
                >
                  <Camera class="w-8 h-8 text-white" />
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2 text-center">
                Cliquez pour changer<br />
                JPG, PNG • Max 2MB
              </p>
            </div>

            <!-- Informations de base -->
            <div class="flex-1">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-white mb-2">{{ userFullName }}</h3>
                <p class="text-gray-400">@{{ formData.pseudo }}</p>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 text-gray-400">
                  <Mail class="w-4 h-4" />
                  <span>{{ formData.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <Calendar class="w-4 h-4" />
                  <span>Membre depuis {{ memberSince }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <Shield class="w-4 h-4" />
                  <span class="capitalize">{{ userRole }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire d'édition du profil -->
        <div class="card">
          <h3 class="text-h2 mb-6">Informations personnelles</h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Ligne Prénom / Nom -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstname" class="label">
                  Prénom
                </label>
                <input
                  id="firstname"
                  v-model="formData.firstname"
                  type="text"
                  class="input"
                  :class="{ 'input-error': validationErrors.firstname }"
                  placeholder="John"
                  :disabled="isLoading"
                />
                <span v-if="validationErrors.firstname" class="error-text">
                  {{ validationErrors.firstname }}
                </span>
              </div>

              <div>
                <label for="lastname" class="label">
                  Nom
                </label>
                <input
                  id="lastname"
                  v-model="formData.lastname"
                  type="text"
                  class="input"
                  :class="{ 'input-error': validationErrors.lastname }"
                  placeholder="Doe"
                  :disabled="isLoading"
                />
                <span v-if="validationErrors.lastname" class="error-text">
                  {{ validationErrors.lastname }}
                </span>
              </div>
            </div>

            <!-- Pseudo -->
            <div>
              <label for="pseudo" class="label label-required">
                Pseudo
              </label>
              <input
                id="pseudo"
                v-model="formData.pseudo"
                type="text"
                class="input"
                :class="{ 'input-error': validationErrors.pseudo }"
                placeholder="Pseudo de joueur"
                :disabled="isLoading"
              />
              <span v-if="validationErrors.pseudo" class="error-text">
                {{ validationErrors.pseudo }}
              </span>
              <span v-else class="helper-text">
                Ce nom sera visible par les autres joueurs
              </span>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="label label-required">
                Adresse email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="input"
                :class="{ 'input-error': validationErrors.email }"
                placeholder="john.doe@example.com"
                :disabled="isLoading"
              />
              <span v-if="validationErrors.email" class="error-text">
                {{ validationErrors.email }}
              </span>
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="label">
                Bio / Description
              </label>
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="4"
                class="input"
                :class="{ 'input-error': validationErrors.bio }"
                placeholder="Parlez-nous de vous et de votre expérience JDR..."
                :disabled="isLoading"
              />
              <span v-if="validationErrors.bio" class="error-text">
                {{ validationErrors.bio }}
              </span>
              <span v-else class="helper-text">
                {{ formData.bio?.length || 0 }}/500 caractères
              </span>
            </div>

            <!-- Préférences de notification -->
            <div>
              <h4 class="text-h3 mb-4">Préférences de notification</h4>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="formData.notifications.email"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    :disabled="isLoading"
                  />
                  <span class="text-gray-300">Notifications par email</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="formData.notifications.gameInvites"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    :disabled="isLoading"
                  />
                  <span class="text-gray-300">Invitations aux parties</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="formData.notifications.newsletter"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500"
                    :disabled="isLoading"
                  />
                  <span class="text-gray-300">Newsletter et mises à jour</span>
                </label>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
              <button
                type="submit"
                class="btn btn-primary btn-lg flex-1 sm:flex-initial"
                :disabled="isLoading || !hasChanges"
              >
                <Save v-if="!isLoading" class="w-4 h-4" />
                <Loader v-else class="w-4 h-4 animate-spin" />
                {{ isLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
              </button>
              <button
                type="button"
                @click="resetForm"
                class="btn btn-secondary btn-lg"
                :disabled="isLoading || !hasChanges"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- Section danger -->
        <div class="card mt-6 border-red-500/20">
          <h3 class="text-h2 mb-6 text-red-400">Zone de danger</h3>
          <div class="space-y-4">
            <div class="p-4 bg-red-500/5 rounded-lg">
              <h4 class="font-semibold text-white mb-2">Supprimer mon compte</h4>
              <p class="text-gray-400 text-sm mb-4">
                Cette action est irréversible. Toutes vos données seront définitivement supprimées.
              </p>
              <button
                @click="showDeleteModal = true"
                class="btn btn-danger btn-sm"
                :disabled="isLoading"
              >
                <Trash2 class="w-4 h-4" />
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmation de suppression -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Overlay -->
          <div
            @click="showDeleteModal = false"
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <!-- Modal -->
          <div class="relative bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle class="w-5 h-5 text-red-400" />
              </div>
              <h3 class="text-lg font-semibold text-white">Supprimer le compte</h3>
            </div>
            
            <p class="text-gray-300 mb-4">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et 
              toutes vos données seront perdues.
            </p>
            
            <div class="mb-6">
              <label class="label">
                Tapez <span class="font-mono text-red-400">{{ deleteConfirmText }}</span> pour confirmer
              </label>
              <input
                v-model="deleteConfirmInput"
                type="text"
                class="input"
                placeholder="Tapez le texte de confirmation"
                @keyup.enter="confirmDelete"
              />
            </div>
            
            <div class="flex gap-3">
              <button
                @click="confirmDelete"
                class="btn btn-danger btn-md flex-1"
                :disabled="deleteConfirmInput !== deleteConfirmText || isDeletingAccount"
              >
                <Trash2 v-if="!isDeletingAccount" class="w-4 h-4" />
                <Loader v-else class="w-4 h-4 animate-spin" />
                {{ isDeletingAccount ? 'Suppression...' : 'Supprimer définitivement' }}
              </button>
              <button
                @click="closeDeleteModal"
                class="btn btn-secondary btn-md"
                :disabled="isDeletingAccount"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Mail, Calendar, Shield, Camera, Save, Loader, 
  LogOut, Trash2, AlertCircle, CheckCircle, AlertTriangle 
} from 'lucide-vue-react'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'
import type { UpdateProfileData, UserProfile } from '@/types/user.types'
import * as yup from 'yup'

// Stores
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

// État local
const fileInput = ref<HTMLInputElement>()
const isLoading = ref(false)
const isDeletingAccount = ref(false)
const successMessage = ref('')
const error = ref('')
const showDeleteModal = ref(false)
const deleteConfirmText = 'SUPPRIMER MON COMPTE'
const deleteConfirmInput = ref('')

// Données du formulaire
const formData = reactive<UpdateProfileData>({
  firstname: '',
  lastname: '',
  pseudo: '',
  email: '',
  bio: '',
  notifications: {
    email: true,
    gameInvites: true,
    newsletter: false
  }
})

// État initial pour détecter les changements
const initialFormData = ref<UpdateProfileData>()

// Erreurs de validation
const validationErrors = reactive<Record<string, string>>({})

// Schéma de validation
const profileSchema = yup.object({
  firstname: yup.string().max(50, 'Le prénom ne doit pas dépasser 50 caractères'),
  lastname: yup.string().max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  pseudo: yup.string()
    .required('Le pseudo est obligatoire')
    .min(3, 'Le pseudo doit contenir au moins 3 caractères')
    .max(20, 'Le pseudo ne doit pas dépasser 20 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores'),
  email: yup.string()
    .required('L\'email est obligatoire')
    .email('L\'email n\'est pas valide'),
  bio: yup.string().max(500, 'La bio ne doit pas dépasser 500 caractères')
})

// Computed
const currentUser = computed(() => authStore.user)
const avatarUrl = computed(() => userStore.avatarUrl || currentUser.value?.avatarUrl)
const userFullName = computed(() => {
  if (!currentUser.value) return ''
  const { firstname, lastname } = currentUser.value
  if (firstname || lastname) {
    return `${firstname || ''} ${lastname || ''}`.trim()
  }
  return currentUser.value.pseudo
})
const memberSince = computed(() => {
  if (!currentUser.value?.createdAt) return ''
  return new Date(currentUser.value.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
})
const userRole = computed(() => {
  if (!currentUser.value?.roles) return 'joueur'
  if (currentUser.value.roles.includes('ROLE_ADMIN')) return 'administrateur'
  if (currentUser.value.roles.includes('ROLE_MASTER')) return 'maître de jeu'
  return 'joueur'
})
const hasChanges = computed(() => {
  if (!initialFormData.value) return false
  return JSON.stringify(formData) !== JSON.stringify(initialFormData.value)
})

// Méthodes
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    error.value = 'Le fichier doit être une image'
    return
  }
  
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'L\'image ne doit pas dépasser 2MB'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    await userStore.uploadAvatar(file)
    successMessage.value = 'Avatar mis à jour avec succès'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err) {
    error.value = 'Erreur lors de l\'upload de l\'avatar'
  } finally {
    isLoading.value = false
    if (target) target.value = ''
  }
}

const validateForm = async (): Promise<boolean> => {
  try {
    await profileSchema.validate(formData, { abortEarly: false })
    Object.keys(validationErrors).forEach(key => delete validationErrors[key])
    return true
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      Object.keys(validationErrors).forEach(key => delete validationErrors[key])
      err.inner.forEach(error => {
        if (error.path) {
          validationErrors[error.path] = error.message
        }
      })
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!await validateForm()) return
  
  isLoading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    await userStore.updateProfile(formData)
    initialFormData.value = { ...formData }
    successMessage.value = 'Profil mis à jour avec succès'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  if (initialFormData.value) {
    Object.assign(formData, initialFormData.value)
    Object.keys(validationErrors).forEach(key => delete validationErrors[key])
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteConfirmInput.value = ''
}

const confirmDelete = async () => {
  if (deleteConfirmInput.value !== deleteConfirmText) return
  
  isDeletingAccount.value = true
  error.value = ''
  
  try {
    await userStore.deleteAccount()
    await authStore.logout()
    router.push('/auth/login')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
    closeDeleteModal()
  } finally {
    isDeletingAccount.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}

// Lifecycle
onMounted(() => {
  if (currentUser.value) {
    formData.firstname = currentUser.value.firstname || ''
    formData.lastname = currentUser.value.lastname || ''
    formData.pseudo = currentUser.value.pseudo
    formData.email = currentUser.value.email
    formData.bio = currentUser.value.bio || ''
    formData.notifications = currentUser.value.notifications || {
      email: true,
      gameInvites: true,
      newsletter: false
    }
    initialFormData.value = { ...formData }
  }
})

// Watchers
watch(() => authStore.user, (newUser) => {
  if (newUser && !initialFormData.value) {
    formData.firstname = newUser.firstname || ''
    formData.lastname = newUser.lastname || ''
    formData.pseudo = newUser.pseudo
    formData.email = newUser.email
    formData.bio = newUser.bio || ''
    formData.notifications = newUser.notifications || {
      email: true,
      gameInvites: true,
      newsletter: false
    }
    initialFormData.value = { ...formData }
  }
})
</script>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>