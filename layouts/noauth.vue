<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="#DAECDA"
    >
    <v-spacer />   

      <v-toolbar-title class="font-weight-bold" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main class="main">
      <v-container>
        <Nuxt class="main" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'NoauthLayout',
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'GOAT Notes'
    }
  },
}
</script>

<style scoped>

.main{
  background-color: #fdfdfd;
}
</style>
