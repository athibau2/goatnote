<template>
    <v-app>
        <v-col v-if="(userData !== null && userData !== undefined)">
          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="5" width="400">
            <v-card-title class="headline">
                {{userData.firstname}} {{userData.lastname}}
            </v-card-title>
            <v-card-subtitle>
                {{userData.email}}
            </v-card-subtitle>
            <v-card-text>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-5"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  v-model="currentPass" 
                  placeholder="Current Password"
                >
                </v-text-field>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-5"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                  v-model="newPass" 
                  placeholder="New Password"
                >
                </v-text-field>
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
    this.$store.dispatch('users/orgs')
  },

  data () {
    return {
      currentPass: "",
      newPass: "",
      show1: false,
      show2: false,
    }
  },

  methods: {
    updatePass () {
      if (this.currentPass === "" || this.newPass === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/updatePass', {
          newPass: this.newPass,
          currentPass: this.currentPass
        })
        this.currentPass = ""
        this.newPass = ""
      }
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

.account-card {
  background-color: #faf9e2;
}

</style>
