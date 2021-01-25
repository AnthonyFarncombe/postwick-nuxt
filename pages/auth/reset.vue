<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Reset Password</v-toolbar-title>
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

            <v-text-field
              id="password"
              v-model.lazy="$v.password.$model"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              :error-messages="passwordErrors"
            ></v-text-field>

            <v-text-field
              id="confirm-password"
              v-model.lazy="$v.confirmPassword.$model"
              label="Confirm Password"
              name="confirm-password"
              prepend-icon="mdi-lock"
              type="password"
              :error-messages="confirmPasswordErrors"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <nuxt-link to="/auth/login">Back to login</nuxt-link>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" :disabled="$v.$invalid" @click="submit">
            {{ resetting ? 'Resetting' : 'Reset' }}
            <v-progress-circular v-if="resetting" indeterminate />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbarError" :timeout="3000" top color="red"
      ><h3 class="mx-auto">{{ snackbarMsg }}</h3></v-snackbar
    >
  </v-row>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
// import { isArray } from 'lodash';

export default {
  data: () => ({
    email: '',
    password: '',
    confirmPassword: '',
    resetting: false,
    snackbarError: false,
    snackbarMsg: 'Unable to reset password!',
  }),
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      ;(!this.$v.email.required || !this.$v.email.email) &&
        errors.push('A valid email address is required')
      return errors
    },
    passwordErrors() {
      if (!this.$v.password.$dirty) return []
      if (!this.$v.password.required) return ['Enter a valid password']

      if (this.password.length < 8)
        return ['Password must be at least eight characters long']

      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
      if (!strongRegex.test(this.password || ''))
        return [
          'Password must contain uppercase, lowercase, numbers and symbols',
        ]

      return []
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.confirmPassword.$dirty) return errors
      !this.$v.confirmPassword.sameAs &&
        errors.push('Enter a matching password')
      return errors
    },
  },
  methods: {
    async submit() {
      this.resetting = true
      try {
        await this.$axios.$post('auth/reset', {
          email: this.email,
          password: this.password,
          token: this.$route.query.token,
        })
        this.$router.push('/auth/login')
      } catch (err) {
        this.snackbarMsg = err
        this.snackbarError = true
        setTimeout(() => this.$router.push('/auth/forgot'), 10000)
      }
      this.resetting = false
    },
  },
  head: {
    title: 'Reset Password',
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
    confirmPassword: {
      sameAs: sameAs('password'),
    },
  },
}
</script>
