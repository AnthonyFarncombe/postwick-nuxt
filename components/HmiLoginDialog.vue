<template>
  <v-dialog v-model="dialog" max-width="280">
    <template v-slot:activator="{ on }">
      <v-btn class="mb-2" v-on="on">Login</v-btn>
    </template>

    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-select
                v-model="user"
                :items="users"
                item-text="name"
                return-object
                label="User"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :value="'*'.repeat(password.length)"
                label="Password"
                readonly
              />
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="password += '7'">7</v-btn>
              <v-btn @click="password += '8'">8</v-btn>
              <v-btn @click="password += '9'">9</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="password += '4'">4</v-btn>
              <v-btn @click="password += '5'">5</v-btn>
              <v-btn @click="password += '6'">6</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn @click="password += '1'">1</v-btn>
              <v-btn @click="password += '2'">2</v-btn>
              <v-btn @click="password += '3'">3</v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="my-1">
            <v-col>
              <v-btn
                :disabled="!password"
                @click="password = password.substr(0, password.length - 1)"
              >
                <v-icon>mdi-backspace</v-icon>
              </v-btn>
              <v-btn @click="password += '0'">0</v-btn>
              <v-btn
                :disabled="!user || password.length < 4"
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
  data: () => ({
    users: [],
    dialog: false,
    user: null,
    password: '',
    loggingIn: false,
  }),
  watch: {
    dialog(val) {
      if (val) {
        this.user = null
        this.$axios
          .$get('auth/users')
          .then((users) => (this.users = users))
          .catch(() => (this.users = []))
      }
    },
  },
  methods: {
    numberClick(num) {
      this.password += num
    },
    async submit() {
      try {
        this.loggingIn = true

        await this.$store.dispatch('login', {
          email: this.user.email,
          password: this.password,
          hmi: true,
        })

        await this.$store.dispatch('loadAuthUser')

        this.dialog = false
      } catch (err) {
        this.password = ''
      } finally {
        this.loggingIn = false
      }
    },
  },
}
</script>
