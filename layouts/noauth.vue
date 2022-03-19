<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="grey"
    >
    <v-spacer />   

      <v-toolbar-title class="font-weight-bold" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'NoauthLayout',
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'GoatNotes'
    }
  },
}
</script>
