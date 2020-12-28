<template>
  <v-simple-table style="max-width: 360px">
    <template v-slot:default>
      <thead>
        <th class="text-left pa-4">Sensor</th>
        <th class="text-right pa-4">Value</th>
      </thead>
      <tbody>
        <tr v-for="sensor in sensors" :key="sensor.name">
          <td class="text-left">{{ sensor.text }}</td>
          <td class="text-right">{{ (sensor.value / 10).toFixed(1) }} °C</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  computed: {
    sensors() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'temperatureSensors'
      )
    },
  },
}
</script>
