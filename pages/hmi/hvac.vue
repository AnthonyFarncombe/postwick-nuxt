<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="3">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <th class="text-left">Sensor</th>
              <th class="text-right">Value</th>
            </thead>
            <tbody>
              <tr v-for="sensor in sensors" :key="sensor.name">
                <td class="text-left">{{ sensor.text }}</td>
                <td class="text-right">
                  {{ (sensor.value / 10).toFixed(1) }} °C
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'hmi',
  computed: {
    sensors() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'temperatureSensors'
      )
    },
  },
  head: {
    title: 'HVAC',
  },
}
</script>
