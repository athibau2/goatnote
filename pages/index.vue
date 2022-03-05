<template>
  <div>
    <v-btn @click="login()">Login</v-btn>
    <div v-if="user !== null">
      Logged in with token {{user}}
    </div>

    <div>
      <v-btn @click="logout()">Logout</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  data () {
    return {
      response: '',
    }
  },

  methods: {
    login() {
      this.$store.dispatch('users/login', {
        email: 'icook8662@gmail.com',
        password: 'password'
      })
    },

    logout() {
      this.$store.dispatch('users/logout')
    }

  },

  computed: {
    user () {
      return this.$store.state.users.user
    },
  }
}
</script>
