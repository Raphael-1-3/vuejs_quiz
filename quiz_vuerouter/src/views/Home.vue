<template>
  <h2>Accueil</h2>
  <button @click="goAbout">Aller à About</button>
</template>

<script>
export default {
  methods: {
    goAbout() {
      this.$router.push('/about')
    }
  }
}
</script>