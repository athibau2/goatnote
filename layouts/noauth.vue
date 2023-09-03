<template>
  <v-app dark>
    <v-app-bar class="app-bar-2"
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
        <v-alert v-if="alert"
          class="alert"
          :color="alert.color"
          :icon="alert.icon"
        >{{alert.text}}</v-alert>
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

  watch: {
    async alert(newValue, oldValue) {
      if (newValue != null && oldValue == null) {
        setTimeout(async () => {
          await this.$store.commit('users/setAlert', null)
        }, 4000);
      }
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
  },

  computed: {
    alert () {
      return this.$store.state.users.alert
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
