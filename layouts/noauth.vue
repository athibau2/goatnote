<template>
  <v-app dark>
    <v-app-bar class="app-bar"
      height="70px"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-spacer />
      <!-- <v-toolbar-title class="font-weight-bold" v-text="title" /> -->
      <img class="logo" src="~/assets/logos/GOAT.png" height="60px">
      <v-spacer />
      <v-btn v-if="windowWidth < 850" height="50px" @click="toggleLoginDialog()" text>Login</v-btn>
    </v-app-bar>

    <v-main class="main">
      <v-container class="main">
        <Nuxt class="main" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'NoauthLayout',

  created () {
    window.addEventListener('resize', this.resizeHandler)
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

</style>
