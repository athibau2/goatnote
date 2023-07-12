<template>
  <v-app dark>
    <v-app-bar class="app-bar"
      height="70px"
      :clipped-left="clipped"
      fixed
      app
    >
      <button @click="toLogin()">
        <img class="logo" src="~/assets/logos/GOAT.png" :height="windowWidth < 850 ? '30px' : '45px'">
      </button>
      <v-spacer />
      <v-btn class="flat-btn" @click="toggleLoginDialog()" text>Login</v-btn>
    </v-app-bar>

    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>

    <Footer />
    
  </v-app>
</template>

<script>
import Footer from '~/components/Footer.vue'

export default {
  name: 'NoauthLayout',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  components: {
    Footer
  },

  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'GOAT Notes',
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    toLogin() {
      this.$router.push('/login')
    },

    toggleLoginDialog() {
      this.$store.dispatch('users/toggleLoginDialog')
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.logo {
  justify-content: center;
}

.flat-btn {
  height: 50px !important;
}

</style>
