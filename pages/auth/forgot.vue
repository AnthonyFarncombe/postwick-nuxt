<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Forgot Password</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model.lazy="$v.email.$model"
              label="Email"
              name="email"
              prepend-icon="mdi-account"
              type="text"
              :error-messages="emailErrors"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <nuxt-link to="/auth/login">Back to login</nuxt-link>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            :disabled="$v.$invalid || sending"
            @click="submit"
          >
            Send email
            <v-progress-circular v-if="sending" indeterminate />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbarError" :timeout="3000" top color="red"
      ><h3 class="mx-auto">Unable to send email!</h3></v-snackbar
    >
    <v-snackbar v-model="snackbarSuccess" :timeout="10000" top color="green"
      ><h3 class="mx-auto">Email sent, please check your inbox.</h3></v-snackbar
    >
  </v-row>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    email: '',
    sending: false,
    snackbarError: false,
    snackbarSuccess: false,
  }),
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      ;(!this.$v.email.required || !this.$v.email.email) &&
        errors.push('A valid email address is required')
      return errors
    },
  },
  methods: {
    async submit() {
      this.sending = true
      try {
        const resetUrl =
          window.location.href.substr(
            0,
            window.location.href.indexOf(this.$route.fullPath)
          ) + '/auth/reset?token={{token}}'

        await this.$axios.$post('api/auth/forgot', {
          email: this.email,
          url: resetUrl,
        })

        this.snackbarSuccess = true
        setTimeout(() => this.$router.push('/auth/login'), 15000)
      } catch (err) {
        this.snackbarError = true
      }
      this.sending = false
    },
  },
  head: {
    title: 'Forgot Password',
  },
  validations: {
    email: {
      required,
      email,
    },
  },
}
</script>
