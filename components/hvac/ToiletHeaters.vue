<template>
  <v-data-table
    :items="toiletHeaters"
    :headers="toiletHeaterHeaders"
    disable-filtering
    disable-pagination
    disable-sort
    hide-default-footer
    :item-class="toiletHeaterItemClass"
  >
    <template v-slot:[`item.value`]="{ value }">
      {{ value ? 'On' : 'Off' }}
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-btn @click="toggleToiletHeater(item)">
        {{ item.value ? 'Turn Off' : 'Turn On' }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    toiletHeaterHeaders: [
      {
        text: 'Heater',
        value: 'text',
      },
      {
        text: 'Status',
        align: 'center',
        value: 'value',
      },
      {
        text: 'Action',
        value: 'action',
        align: 'center',
      },
    ],
  }),
  computed: {
    toiletHeaters() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'toiletHeaters'
      )
    },
  },
  methods: {
    toggleToiletHeater(item) {
      const name = 'toggle' + item.name[0].toUpperCase() + item.name.substr(1)
      this.$store.dispatch('setVariableValue', {
        name,
        value: true,
      })
    },
    toiletHeaterItemClass(item) {
      return item.value ? 'green' : 'red'
    },
  },
}
</script>
