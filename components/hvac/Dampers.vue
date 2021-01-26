<template>
  <v-data-table
    :items="dampers"
    :headers="damperHeaders"
    disable-filtering
    disable-pagination
    disable-sort
    hide-default-footer
  >
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    damperHeaders: [
      {
        text: 'Damper',
        value: 'text',
      },
    ],
  }),
  computed: {
    dampers() {
      return this.$store.state.variables.filter((v) => v.group === 'dampers')
    },
  },
}
</script>
