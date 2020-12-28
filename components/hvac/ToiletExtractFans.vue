<template>
  <v-data-table
    :items="toiletExtractFans"
    :headers="toiletExtractFanHeaders"
    disable-filtering
    disable-pagination
    disable-sort
    hide-default-footer
  >
    <template v-slot:[`item.status`]="{ item }">
      {{ getExtractFanStatus(item) }}
    </template>

    <template v-slot:[`item.speed`]="{ item }">
      {{ item.actlVelo.value }}
    </template>

    <template v-slot:[`item.action`]="{ item }">
      <v-btn @click="toggleToiletExtractFan(item.toggleName)">
        {{ (item.axisStatus.value & 0x40) > 0 ? 'Stop' : 'Start' }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    toiletExtractFans: [],
    toiletExtractFanHeaders: [
      {
        text: 'Extract Fan',
        value: 'text',
      },
      {
        text: 'Status',
        value: 'status',
        align: 'center',
      },
      {
        text: 'Speed',
        value: 'speed',
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
    this.toiletExtractFans = [
      {
        text: 'Gents Extract Fan',
        toggleName: 'toggleExtractGents',
        statusAdapter: this.$store.state.variables.find(
          (v) => v.name === 'extractGentsStatusAdapter'
        ) || { value: 0 },
        errId: this.$store.state.variables.find(
          (v) => v.name === 'extractGentsErrId'
        ) || { value: 0 },
        actlVelo: this.$store.state.variables.find(
          (v) => v.name === 'extractGentsActlVelo'
        ) || { value: 0 },
        axisStatus: this.$store.state.variables.find(
          (v) => v.name === 'extractGentsAxisStatus'
        ) || { value: 0 },
      },
      {
        text: 'Ladies Extract Fan',
        toggleName: 'toggleExtractLadies',
        statusAdapter: this.$store.state.variables.find(
          (v) => v.name === 'extractLadiesStatusAdapter'
        ) || { value: 0 },
        errId: this.$store.state.variables.find(
          (v) => v.name === 'extractLadiesErrId'
        ) || { value: 0 },
        actlVelo: this.$store.state.variables.find(
          (v) => v.name === 'extractLadiesActlVelo'
        ) || { value: 0 },
        axisStatus: this.$store.state.variables.find(
          (v) => v.name === 'extractLadiesAxisStatus'
        ) || { value: 0 },
      },
    ]
  },
  methods: {
    getExtractFanStatus(item) {
      if (item.statusAdapter.value === 5) {
        return 'Comms Error'
      } else if (item.errId.value > 0) {
        return `Error ${item.errId.value}`
      } else if ((item.axisStatus.value & 0x40) > 0) {
        return 'Running'
      } else if ((item.axisStatus.value & 0x2) > 0) {
        return 'Stopped'
      }
      return 'Unknown'
    },
    toggleToiletExtractFan(name) {
      this.$store.dispatch('setVariableValue', {
        name,
        value: true,
      })
    },
  },
}
</script>
