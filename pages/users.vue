<template>
  <div>
    <h1>Users</h1>

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" class="mb-2" v-on="on">New User</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="$v.editedUser.firstName.$model"
                  :error-messages="firstNameErrors"
                  label="First Name"
                />
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="$v.editedUser.lastName.$model"
                  :error-messages="lastNameErrors"
                  label="Last Name"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="$v.editedUser.email.$model"
                  :error-messages="emailErrors"
                  label="Email"
                />
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="editedUser.roles"
                  label="Roles"
                  :items="roles"
                  multiple
                  chips
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="editedUser.notifications"
                  label="Notifications"
                  :items="notifications"
                  multiple
                  chips
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!formValid" @click="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="usersSorted"
      disable-pagination
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:[`item.name`]="{ item }">
        {{ `${item.firstName} ${item.lastName}` }}
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-icon small class="mr-2" @click="editUser(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  layout: 'hmi',
  async asyncData({ $axios }) {
    const results = await Promise.all([
      $axios.$get('users/roles'),
      $axios.$get('users/notifications'),
      $axios.$get('users'),
    ])
    return {
      roles: results[0],
      notifications: results[1],
      users: results[2],
    }
  },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name', sortable: false },
      { text: 'Email', value: 'email', sortable: false },
      { text: 'Actions', value: 'action', sortable: false },
    ],
    dialog: false,
    editedIndex: -1,
    editedUser: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
      notifications: [],
    },
    defaultUser: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
      notifications: [],
    },
  }),
  computed: {
    usersSorted() {
      const users = this.users
      users.sort((a, b) =>
        a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0
      )
      return users
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.editedUser.firstName.$dirty) return errors
      if (!this.$v.editedUser.firstName.required)
        errors.push('First name is required')
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.editedUser.lastName.$dirty) return errors
      if (!this.$v.editedUser.lastName.required)
        errors.push('Last name is required')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.editedUser.email.$dirty) return errors
      if (!this.$v.editedUser.email.required) errors.push('Email is required')
      if (!this.$v.editedUser.email.email)
        errors.push('A valid email address is required')
      return errors
    },
    formValid() {
      return (
        !this.$v.editedUser.firstName.$invalid &&
        !this.$v.editedUser.lastName.$invalid &&
        !this.$v.editedUser.email.$invalid &&
        !this.$v.editedUser.$invalid
      )
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  methods: {
    editUser(user) {
      this.editedIndex = this.users.indexOf(user)
      this.editedUser = {
        ...user,
        roles: this.roles.filter((r) => user.roles.includes(r)),
      }
      this.dialog = true
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete ${user.firstName}?`)) return
      await this.$axios.$delete(`users/${user.id}`)
      const index = this.users.indexOf(user)
      this.users.splice(index, 1)
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      }, 300)
    },
    async save() {
      if (this.editedIndex > -1) {
        await this.$axios.$put(`users/${this.editedUser.id}`, this.editedUser)
        Object.assign(this.users[this.editedIndex], this.editedUser)
      } else {
        const user = await this.$axios.$post('users', this.editedUser)
        this.users.push(user)
      }
      this.close()
    },
  },
  head: {
    title: 'Users',
  },
  meta: {
    role: 'users',
  },
  validations: {
    editedUser: {
      firstName: {
        required,
      },
      lastName: {
        required,
      },
      email: {
        required,
        email,
      },
    },
  },
}
</script>
