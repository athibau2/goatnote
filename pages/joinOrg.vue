<template>
    <v-app>
        Join Org
        
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'JoinOrgPage',
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
