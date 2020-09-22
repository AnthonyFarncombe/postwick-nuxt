<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="8" lg="6" xl="6">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr
                v-for="light in lights"
                :key="light.name"
                :class="lightClass(light)"
              >
                <td class="text-left">
                  <span class="title">{{ light.text }}</span>
                </td>
                <td class="text-right">
                  <v-btn class="default mx-4" @click="toggle(light)"
                    >Toggle</v-btn
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
  computed: {
    lights() {
      return this.$store.state.variables.filter(
        (v) => v.group === 'lights' && /.+Status$/.test(v.name)
      )
    },
  },
  methods: {
    lightClass(light) {
      switch (light.value) {
        case 3:
          return 'orange'
        case 1:
          return 'green'
        default:
          return 'red'
      }
    },
    toggle(light) {
      this.$store.dispatch('setVariableValue', {
        name: light.name.substr(0, light.name.length - 6) + 'Toggle',
        value: true,
      })
    },
  },
  head: {
    title: 'Lights',
  },
}
</script>
