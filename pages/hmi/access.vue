<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="6">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr
                :class="
                  securityAlarmTriggered.value
                    ? 'red'
                    : securityAlarmEnabled.value
                    ? 'blue'
                    : 'green'
                "
              >
                <td class="text-left">
                  <span class="title">Security Alarm</span>
                </td>
                <td class="text-right">
                  <span class="title">{{
                    securityAlarmTriggered.value
                      ? 'Triggered'
                      : securityAlarmEnabled.value
                      ? 'Enabled'
                      : 'Disabled'
                  }}</span>
                </td>
              </tr>
              <tr :class="fireAlarmTriggered.value ? 'red' : 'blue'">
                <td class="text-left">
                  <span class="title">Fire Alarm</span>
                </td>
                <td class="text-right">
                  <span class="title">{{
                    fireAlarmTriggered.value ? 'Triggered' : 'Enabled'
                  }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col sm="12" md="8" lg="6" xl="6">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr :class="doorSystemEnabled.value ? 'green' : 'red'">
                <td class="text-left">
                  <span class="title"
                    >Door System
                    {{ doorSystemEnabled.value ? 'Enabled' : 'Disabled' }}</span
                  >
                </td>
                <td class="text-right">
                  <v-btn @click="toggleDoorSystemEnable">{{
                    doorSystemEnabled.value ? 'Disable' : 'Enable'
                  }}</v-btn>
                </td>
              </tr>
              <tr :class="gateColor">
                <td class="text-left">
                  <span class="title">{{ gateText }}</span>
                </td>
                <td class="text-right">
                  <v-btn
                    v-if="
                      !doorSystemEnabled.value && !securityAlarmEnabled.value
                    "
                    @click="toggleGateHold"
                    >{{
                      gateHeldOpen.value ? 'Release Hold' : 'Hold Open'
                    }}</v-btn
                  >
                  <v-btn
                    v-if="
                      !doorSystemEnabled.value &&
                      (gateClosed.value || gateMoving.value)
                    "
                    @click="openGate"
                    >Open</v-btn
                  >
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
  asyncData({ store }) {
    const securityAlarmEnabled =
      store.state.variables.find((v) => v.name === 'securityAlarmEnabled') || {}

    const securityAlarmTriggered =
      store.state.variables.find((v) => v.name === 'securityAlarmTriggered') ||
      {}

    const fireAlarmTriggered =
      store.state.variables.find((v) => v.name === 'fireAlarmTriggered') || {}

    const doorSystemEnabled = store.state.variables.find(
      (v) => v.name === 'doorSystemEnabled'
    ) || { value: false }

    const gateClosed = store.state.variables.find(
      (v) => v.name === 'gateClosed'
    ) || { value: false }

    const gateMoving = store.state.variables.find(
      (v) => v.name === 'gateMoving'
    ) || { value: false }

    const gateHeldOpen = store.state.variables.find(
      (v) => v.name === 'gateHeldOpen'
    ) || { value: false }

    return {
      securityAlarmEnabled,
      securityAlarmTriggered,
      fireAlarmTriggered,
      doorSystemEnabled,
      gateClosed,
      gateMoving,
      gateHeldOpen,
    }
  },
  computed: {
    gateColor() {
      return this.gateMoving.value
        ? 'amber'
        : this.gateClosed.value
        ? 'red'
        : this.gateHeldOpen.value
        ? 'blue'
        : 'green'
    },
    gateText() {
      return (
        'Gate ' +
        (this.gateMoving.value
          ? 'Moving'
          : this.gateClosed.value
          ? 'Closed'
          : this.gateHeldOpen.value
          ? 'Held Open'
          : 'Open')
      )
    },
  },
  methods: {
    toggleDoorSystemEnable() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleDoorSystem',
        value: true,
      })
    },
    openGate() {
      this.$store.dispatch('setVariableValue', {
        name: 'openGate',
        value: true,
      })
    },
    toggleGateHold() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleGateHold',
        value: true,
      })
    },
  },
  head: {
    title: 'Access',
  },
}
</script>
