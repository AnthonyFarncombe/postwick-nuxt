<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">Setup HMI Pin</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1"
                >Start</v-stepper-step
              >
              <v-divider />
              <v-stepper-step :complete="step > 2" step="2"
                >Scan</v-stepper-step
              >
              <v-divider />
              <v-stepper-step :complete="step > 3" step="3"
                >Confirm</v-stepper-step
              >
              <v-divider />
              <v-stepper-step :complete="step > 4" step="4"
                >Complete</v-stepper-step
              >
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12 pa-6" color="grey darken-3" height="240px">
                  <h4>
                    To setup the HMI pin you will need the Google Authenticator
                    app installed on your phone
                  </h4>
                </v-card>

                <v-btn color="primary" @click="generateQr">Continue</v-btn>
                <v-btn text @click="$emit('input', false)">Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color="grey darken-3" height="240px">
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <canvas ref="qrCanvas"></canvas>
                      </v-col>
                      <v-col cols="6">
                        <h4>
                          Scan the QR code using the Google Authenticator app
                        </h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>

                <v-btn color="primary" @click="step = 3">Continue</v-btn>
                <v-btn text @click="$emit('input', false)">Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card class="mb-12 pa-6" color="grey darken-3" height="240px">
                  <v-text-field
                    v-model="hmiPin"
                    label="Enter the pin from the app"
                  />
                </v-card>

                <v-btn
                  color="primary"
                  :disabled="hmiPin.length < 6"
                  @click="verifyPin"
                >
                  Continue
                </v-btn>
                <v-btn text @click="$emit('input', false)">Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-content step="4">
                <v-card class="mb-12 pa-6" color="grey darken-3" height="240px">
                  <h4>HMI auth setup complete</h4>
                </v-card>

                <v-btn color="primary" @click="$emit('input', false)"
                  >Complete</v-btn
                >
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import qrcode from 'qrcode'

export default {
  props: {
    value: Boolean,
  },
  data: () => ({
    step: 1,
    hmiPin: '',
    loggingIn: false,
  }),
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
        this.hmiPin = ''
      },
    },
  },
  watch: {
    value(val) {
      if (val) this.step = 1
    },
  },
  methods: {
    async generateQr() {
      this.step = 2
      const { secret } = await this.$axios.$post('auth/setuphmipin')
      qrcode.toCanvas(this.$refs.qrCanvas, secret)
    },
    async verifyPin() {
      try {
        await this.$axios.$post('auth/verifyhmipin', {
          token: this.hmiPin,
          confirm: true,
        })
        this.step = 4
      } catch (err) {
        await this.generateQr()
      }
    },
    numberClick(num) {
      this.hmiPin += num
    },
    async submit() {
      try {
        this.loggingIn = true
        await this.$store.dispatch('login', {
          email: this.user.email,
          hmiPin: this.hmiPin,
          hmi: true,
        })
        await this.$store.dispatch('loadAuthUser')
        this.show = false
      } catch (err) {
        this.hmiPin = ''
      } finally {
        this.loggingIn = false
      }
    },
  },
}
</script>
