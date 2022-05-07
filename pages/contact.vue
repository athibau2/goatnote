<template>
    <v-app>
        Contact Us Page
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'ContactPage',
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
