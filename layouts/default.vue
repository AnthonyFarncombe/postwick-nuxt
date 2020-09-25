<template>
  <v-app dark>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} NCH Construction Ltd</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  head: {
    title: 'Home',
  },
}
</script>
