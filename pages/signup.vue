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
                        <v-text-field
                            class="selector"
                            dense
                            solo
                            rounded
                            background-color="light blue lighten-5"
                            v-model="firstname"
                            placeholder="First name"
                        >
                        </v-text-field>
                        <v-text-field
                            class="selector"
                            dense
                            solo
                            rounded
                            background-color="light blue lighten-5"
                            v-model="lastname"
                            placeholder="Last name"
                        >
                        </v-text-field>
                        <v-text-field
                            class="selector"
                            dense
                            solo
                            rounded
                            background-color="light blue lighten-5"
                            v-model="email"
                            :append-icon="'mdi-email'"
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
                            @keyup.enter="signup()"
                            placeholder="Enter your password"
                        >
                        </v-text-field>
                        <em><h5>&nbsp;Password must be at least 8 characters</h5></em>
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
        password: "",
        show: false,
    }
  },

  methods: {
    signup() {
        if (this.firstname === "" || this.lastname === "" || this.email === "" || this.password === "") {
            alert('No field may be left empty')
        }
        else {
            this.$store.dispatch('users/signup', {
                firstname: this.firstname,
                lastname: this.lastname,
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