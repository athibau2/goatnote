<template>
    <v-app>
        <v-col>
            <v-row justify="center" align="center">
                <v-card color="light yellow lighten-4" elevation="5" width="400">
                <v-card-title  class="headline">
                    Welcome to GoatNotes!
                </v-card-title>
                <v-card-subtitle>
                    Sign In Here
                </v-card-subtitle>
                <v-card-text>
                    <input v-model="email" placeholder="Enter your email" required>
                    <div class="entry1" >
                        <input v-model="password" type="password" placeholder="Enter your password" required>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <nuxt-link to="/signup">Join Here</nuxt-link>
                    <span>&nbsp;</span>
                    <v-btn color="primary" nuxt @click="login()">
                        Sign In
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-row>
        </v-col>
    </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',

  data () {
    return {
      email: "",
      password: ""
    }
  },

  methods: {
    login() {
      this.$store.dispatch('users/login', {
        email: this.email,
        password: this.password
      })
    },
  },

  computed: {
    user () {
      return this.$store.state.users.user
    }
  },

}
</script>
<style scoped>
.entry1{
  margin-top: 15px;
}
</style>