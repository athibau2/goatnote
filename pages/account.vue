<template>
    <v-app>
        <v-col v-if="(userData !== null && userData !== undefined)">
          <v-row justify="center" align="center">
            <v-card color="light yellow lighten-4" elevation="5" width="400">
            <v-card-title class="headline">
                {{userData.firstname}} {{userData.lastname}}
            </v-card-title>
            <v-card-subtitle>
                {{userData.email}}
            </v-card-subtitle>
            <v-card-text>
                <input v-model="currentPass" type="password" placeholder="Current Password">
                <input v-model="newPass" type="password" placeholder="New Password">
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="light red lighten-2" @click="deleteAccount()">Delete Account</v-btn>
                <v-btn color="primary" @click="updatePass()">Update Password</v-btn>
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
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/userData')
  },

  data () {
    return {
      currentPass: "",
      newPass: "",
    }
  },

  methods: {
    updatePass () {
      this.$store.dispatch('users/updatePass', {
        newPass: this.newPass,
        currentPass: this.currentPass

      })
      this.currentPass = ""
      this.newPass = ""
    },

    deleteAccount () {
      if(confirm("Are you sure you want to delete your account?")) {
        this.$store.dispatch('users/deleteAccount')
      }
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

<style scoped>
@import '~/assets/styles.css';

</style>
