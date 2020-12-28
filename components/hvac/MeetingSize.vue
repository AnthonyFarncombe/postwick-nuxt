<template>
  <v-card>
    <v-card-title>
      <h4>Meeting Size</h4>
    </v-card-title>

    <v-divider />

    <v-radio-group
      :value="meetingSize.value"
      column
      class="ml-4"
      @change="changeMeetingSize"
    >
      <!-- <v-radio label="Manual" :value="0" class="my-2" /> -->
      <v-radio label="Auto (set by schedule)" :value="0" class="my-2" />
      <v-radio label="Maintenance (empty hall)" :value="1" class="my-2" />
      <v-radio label="Local (up to 50 people)" :value="2" class="my-2" />
      <v-radio label="City (up to 250 people)" :value="3" class="my-2" />
      <v-radio label="Interchange (up to 600 people)" :value="4" class="my-2" />
      <v-radio label="Full (max capacity)" :value="5" class="my-2" />
    </v-radio-group>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    meetingSize: { value: 0 },
  }),
  created() {
    this.meetingSize = this.$store.state.variables.find(
      (v) => v.name === 'meetingSize'
    ) || { value: 0 }
  },
  methods: {
    changeMeetingSize(value) {
      this.$store.dispatch('setVariableValue', {
        name: 'meetingSize',
        value,
      })
    },
  },
}
</script>
