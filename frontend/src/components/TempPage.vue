<template>
  <div class="temp-page">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <div class="links">
      <router-link to="/auth/login">Connexion</router-link>
      <span> | </span>
      <router-link to="/auth/register">Inscription</router-link>
      <span> | </span>
      <router-link to="/">Accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<style scoped>
.temp-page {
  padding: 2rem;
  text-align: center;
  color: #fff;
  background: #1a0b2e;
  min-height: 100vh;
}

h1 {
  margin-bottom: 1rem;
  color: #6366f1;
}

p {
  margin-bottom: 2rem;
  color: #94a3b8;
}

.links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.links a {
  color: #6366f1;
  text-decoration: underline;
}

.links a:hover {
  color: #818cf8;
}
</style>