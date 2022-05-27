<template>
  <v-app dark>
    <v-app-bar height="70px"
      :clipped-left="clipped"
      fixed
      app
      color="#DAECDA"
    >
      <v-spacer />
      <!-- <v-toolbar-title class="font-weight-bold" v-text="title" /> -->
      <img class="logo" src="~/assets/logos/GOAT.png" height="60px">
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
      title: 'GOAT Notes',
    }
  },
}
</script>

<style scoped>

.main{
  background-color: #fdfdfd;
}

.logo {
  justify-content: center;
}

</style>
