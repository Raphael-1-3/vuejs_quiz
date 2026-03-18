<script setup></script>

<template>
  <nav>
    <router-link to="/">Accueil</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link to="/questionnaire">Qestionnaire</router-link>
  </nav>

  <router-view />
</template>

<style scoped></style>
