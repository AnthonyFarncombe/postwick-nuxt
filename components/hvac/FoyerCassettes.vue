<template>
  <v-data-table
    :items="cassettes"
    :headers="cassetteHeaders"
    disable-filtering
    disable-pagination
    disable-sort
    hide-default-footer
    :item-class="cassetteItemClass"
  >
    <template v-slot:[`item.command`]="{ item }">
      {{ (item.value & 0x4) > 0 ? 'Requesting' : 'No Command' }}
    </template>

    <template v-slot:[`item.running`]="{ item }">
      {{ (item.value & 0x8) > 0 ? 'Running' : 'Off' }}
    </template>

    <template v-slot:[`item.fault`]="{ item }">
      {{ (item.value & 0x10) > 0 ? 'Fault' : 'OK' }}
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-btn @click="toggleCassette(item)"
        >Turn {{ (item.value & 0x8) > 0 ? 'Off' : 'On' }}</v-btn
      >
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    cassettes: [],
    cassetteHeaders: [
      {
        text: 'Cassette',
        value: 'text',
      },
      {
        text: 'Command',
        value: 'command',
        align: 'center',
      },
      {
        text: 'Running',
        value: 'running',
        align: 'center',
      },
      {
        text: 'Fault',
        value: 'fault',
        align: 'center',
      },
      {
        text: 'Action',
        value: 'action',
        align: 'center',
      },
    ],
  }),
  created() {
    this.cassettes = this.$store.state.variables.filter(
      (v) => v.group === 'cassettes'
    )
  },
  methods: {
    toggleCassette(item) {
      const name =
        'toggle' +
        item.name[0].toUpperCase() +
        item.name.substr(1, item.name.length - 7) +
        's'
      this.$store.dispatch('setVariableValue', { name, value: true })
    },
    cassetteItemClass(item) {
      if ((item.value & 0x10) > 0) {
        return 'orange'
      } else if ((item.value & 0x8) > 0) {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
}
</script>
