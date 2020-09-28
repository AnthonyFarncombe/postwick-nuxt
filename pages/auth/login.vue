<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form @submit="submit">
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <nuxt-link to="/auth/forgot">Forgot password?</nuxt-link>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            :disabled="$v.$invalid"
            :loading="loggingIn"
            @click="submit"
            >Login</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    email: '',
    password: '',
    loggingIn: false,
  }),
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      if (!this.$v.email.required || !this.$v.email.email)
        errors.push('A valid email address is required')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      if (!this.$v.password.required) errors.push('Enter a valid password')
      return errors
    },
  },
  methods: {
    async submit() {
      this.loggingIn = true
      try {
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        })

        if (this.$route.query && this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect)
        } else {
          this.$router.push('/')
        }
      } catch (err) {
        this.password = ''
      }
      this.loggingIn = false
    },
  },
  head: {
    title: 'Login',
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
}
</script>
