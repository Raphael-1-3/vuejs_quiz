<script setup></script>

<template>
  <nav>
    <router-link to="/">Accueil</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link to="/questionnaire">Questionnaire</router-link>
    |
    <router-link to="/edit-questionnaire">Edit Questionnaire</router-link>
  </nav>

  <router-view />
</template>

<style scoped></style>
