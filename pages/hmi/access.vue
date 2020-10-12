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

              <tr :class="northFoyerLocked.value ? 'red' : 'green'">
                <td class="text-left">
                  <span class="title"
                    >North Foyer
                    {{ northFoyerLocked.value ? 'Locked' : 'Unlocked' }}</span
                  >
                </td>
                <td class="text-right">
                  <v-btn @click="toggleNorthFoyerLocked">{{
                    northFoyerLocked.value ? 'Unlock' : 'Lock'
                  }}</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-row>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Door</th>
              <th>Maglock</th>
              <th>Lock Proof</th>
              <th>Sensor</th>
              <th>Break Glass</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="door in doors" :key="door.name">
              <td>{{ door.text }} ({{ door.value }})</td>
              <td>
                <span v-if="(door.value & 0x200) > 0">{{
                  (door.value & 0x4) > 0 ? 'Energised' : 'Released'
                }}</span>
              </td>
              <td>
                <span v-if="(door.value & 0x400) > 0">{{
                  (door.value & 0x8) > 0 ? 'Pending' : 'Locked'
                }}</span>
              </td>
              <td>
                <span v-if="(door.value & 0x800) > 0">{{
                  (door.value & 0x10) > 0 ? 'Closed' : 'Open'
                }}</span>
              </td>
              <td>
                <span v-if="(door.value & 0x1000) > 0">{{
                  (door.value & 0x20) > 0 ? 'Healthy' : 'Broken'
                }}</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'hmi',
  data: () => ({
    securityAlarmEnabled: { value: false },
    securityAlarmTriggered: { value: false },
    fireAlarmTriggered: { value: false },
    gateClosed: { value: false },
    gateMoving: { value: false },
    gateHeldOpen: { value: false },
    doorSystemEnabled: { value: false },
    northFoyerLocked: { value: false },
    doors: [],
  }),
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
  created() {
    this.securityAlarmEnabled = this.$store.state.variables.find(
      (v) => v.name === 'securityAlarmEnabled'
    ) || { value: false }

    this.securityAlarmTriggered = this.$store.state.variables.find(
      (v) => v.name === 'securityAlarmTriggered'
    ) || { value: false }

    this.fireAlarmTriggered = this.$store.state.variables.find(
      (v) => v.name === 'fireAlarmTriggered'
    ) || { value: false }

    this.gateClosed = this.$store.state.variables.find(
      (v) => v.name === 'gateClosed'
    ) || { value: false }

    this.gateMoving = this.$store.state.variables.find(
      (v) => v.name === 'gateMoving'
    ) || { value: false }

    this.gateHeldOpen = this.$store.state.variables.find(
      (v) => v.name === 'gateHeldOpen'
    ) || { value: false }

    this.doorSystemEnabled = this.$store.state.variables.find(
      (v) => v.name === 'doorSystemEnabled'
    ) || { value: false }

    this.northFoyerLocked = this.$store.state.variables.find(
      (v) => v.name === 'northFoyerLocked'
    ) || { value: false }

    this.doors = this.$store.state.variables.filter((v) => v.group === 'doors')
  },
  methods: {
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
    toggleDoorSystemEnable() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleDoorSystem',
        value: true,
      })
    },
    toggleNorthFoyerLocked() {
      this.$store.dispatch('setVariableValue', {
        name: 'toggleNorthFoyerLocked',
        value: true,
      })
    },
  },
  head: {
    title: 'Access',
  },
}
</script>
