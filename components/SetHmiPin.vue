<template>
  <v-dialog
    v-model="dialog"
    :value="dialog"
    max-width="280"
    @change="$emit('change')"
  >
    <template v-slot:activator="{ on }">
      <v-list-item-title v-on="on">Set HMI Pin</v-list-item-title>
    </template>

    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field :value="hmiPin" label="HMI Pin" />
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="hmiPin += '7'">7</v-btn>
              <v-btn @click="hmiPin += '8'">8</v-btn>
              <v-btn @click="hmiPin += '9'">9</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="hmiPin += '4'">4</v-btn>
              <v-btn @click="hmiPin += '5'">5</v-btn>
              <v-btn @click="hmiPin += '6'">6</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="hmiPin += '1'">1</v-btn>
              <v-btn @click="hmiPin += '2'">2</v-btn>
              <v-btn @click="hmiPin += '3'">3</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn
                :disabled="!hmiPin"
                @click="hmiPin = hmiPin.substr(0, hmiPin.length - 1)"
              >
                <v-icon>mdi-backspace</v-icon>
              </v-btn>
              <v-btn @click="hmiPin += '0'">0</v-btn>
              <v-btn
                :disabled="hmiPin.length < 4"
                :loading="loggingIn"
                @click="submit"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
  },
  data: () => ({
    hmiPin: '',
    loggingIn: false,
  }),
  methods: {
    numberClick(num) {
      this.hmiPin += num
    },
    async submit() {
      // try {
      //   this.loggingIn = true
      //   await this.$store.dispatch('login', {
      //     email: this.user.email,
      //     hmiPin: this.hmiPin,
      //     hmi: true,
      //   })
      //   await this.$store.dispatch('loadAuthUser')
      //   this.dialog = false
      // } catch (err) {
      //   this.hmiPin = ''
      // } finally {
      //   this.loggingIn = false
      // }
    },
  },
}
</script>
