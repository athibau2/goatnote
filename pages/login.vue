<template>
    <v-app class="app">
      <v-container>
        <v-col>
            <v-row justify="center" align="center">
                <v-card color="light yellow lighten-4" elevation="5" width="400">
                <v-card-title  class="headline">
                    Welcome to GOAT Notes!
                </v-card-title>
                <v-card-subtitle>
                    Sign In Here
                </v-card-subtitle>
                <v-card-text>
                    <v-text-field
                      class="selector"
                      dense
                      solo
                      rounded
                      background-color="light blue lighten-5"
                      :append-icon="'mdi-email'"
                      v-model="email"
                      placeholder="Enter your email"
                    >
                    </v-text-field>
                    <v-text-field
                      class="selector"
                      dense
                      solo
                      rounded
                      background-color="light blue lighten-5"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show ? 'text' : 'password'"
                      @click:append="show = !show"
                      v-model="password"
                      @keyup.enter="login()"
                      placeholder="Enter your password"
                    >
                    </v-text-field>
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
      </v-container>
    </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'noauth',

  data () {
    return {
      email: "",
      password: "",
      show: false
    }
  },

  methods: {
    login() {
      if (this.email === "" || this.password === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/login', {
          email: this.email,
          password: this.password
        })
      }
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
@import '~/assets/styles.css';

.app{
    background: url('~@/static/goats.png');
    background-size: 25%;
    background-repeat: repeat;
}

</style>