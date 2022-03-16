<template>
    <v-app>
        <v-col v-if="(userData !== null && userData !== undefined)">
          <v-row justify="center" align="center">
            <v-card elevation="5" width="400">
            <v-card-title class="headline">
                {{userData.firstname}} {{userData.lastname}}
            </v-card-title>
            <v-card-subtitle>
                {{userData.email}}
            </v-card-subtitle>
            <v-card-subtitle>
                Password: {{userData.password}}
            </v-card-subtitle>
            <v-card-text>
                <input v-model="newPass" type="password" placeholder="New Password">
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="updatePass()">Update Password</v-btn>
            </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'AccountPage',
  middleware: "auth",

  mounted () {
    this.$store.dispatch('users/userData')
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
  },

  data () {
    return {
      newPass: "",
    }
  },

  methods: {
    updatePass () {
      this.$store.dispatch('users/updatePass', {
        password: this.newPass
      })
      this.newPass = ""
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    userData () {
        return this.$store.state.users.userData
    }

  }
}
</script>
