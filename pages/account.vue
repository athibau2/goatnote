<template>
    <v-app>
        <div v-if="(userData !== null && userData !== undefined)">
            <!-- <div v-if="user.email === userData.email"> -->
                <v-card elevation="5" width="400">
                <v-card-title class="headline">
                    {{userData.firstname}} {{userData.lastname}}
                </v-card-title>
                <v-card-subtitle>
                    {{userData.email}}
                </v-card-subtitle>
                <v-card-subtitle>
                    {{userData.password}}
                </v-card-subtitle>
                <v-card-actions>
                    <v-spacer />
                    <v-btn>Go</v-btn>
                </v-card-actions>
                </v-card>
            <!-- </div> -->
        </div>
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
      response: '',
    }
  },

  methods: {
    
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
