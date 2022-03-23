<template>
    <v-app class="app">
        <v-container>
            <v-col>
                <v-row justify="center" align="center">
                    <v-card color="light yellow lighten-4" elevation="5" width="400">
                    <v-card-title class="headline">
                        Welcome to GOAT Notes!
                    </v-card-title>
                    <v-card-subtitle>
                        Sign Up Here
                    </v-card-subtitle>
                    <v-card-text>
                        <input class="name" v-model="firstname" placeholder="Enter your first name" required>
                        <input class="name" v-model="lastname" placeholder="Enter your last name" required>
                        <div>
                            <input v-model="email" placeholder="Enter your email" required>
                        </div>
                        <div>
                            <input v-model="password" type="password" placeholder="Enter your password" required>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <nuxt-link to="/login">Sign In</nuxt-link>
                        <span>&nbsp;</span>
                        <v-btn color="primary" nuxt @click="signup()">
                            Sign Up
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
  name: 'SignupPage',
  layout: 'noauth',

  data () {
    return {
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    }
  },

  methods: {
    signup() {
        this.$store.dispatch('users/signup', {
            firstname: this.firstname,
            lastname: this.lastname,
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
@import '~/assets/styles.css';

.name{
    width: 39.5%;
}

.app{
    background: url('~@/static/goats.png');
    background-size: 25%;
    background-repeat: repeat;
}

</style>