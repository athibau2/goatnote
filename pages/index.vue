<template>
  <div>
    <div v-if="user !== null">
      Logged in with token {{user}}
    </div>

  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  //middleware: "auth",

  data () {
    return {
      response: '',
    }
  },

  methods: {
    

  },

  computed: {
    user () {
      return this.$store.state.users.user
    },
  }
}
</script>
