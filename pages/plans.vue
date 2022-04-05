<template>
    <v-app>
      Plans
        
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'PlansPage',
  middleware: "auth",

  mounted () {

  },

  data () {
    return {

    }
  },

  methods: {

  },

  computed: {


  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

</style>
