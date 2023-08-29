<template>
    <v-footer class="footer"
      absolute
      app
      color="#eeeeee"
    >
      <v-col cols="8">
        <span>&copy; 2022 Delta Apps, LLC</span><br>
        <a target="_blank" href="https://deltaapps.dev/goatnotes/privacy_policy.pdf">Privacy Policy</a><br>
        <a target="_blank" href="https://deltaapps.dev/goatnotes/terms_conditions.pdf">Terms and Conditions</a><br>
      </v-col>
      <v-col class="text-right" cols="4">
        <a target="_blank" href="https://deltaapps.dev/contact">Contact Us</a><br>
        <a target="_blank" href="https://forms.gle/FeVtuMJvpX2zRH4u6">Submit Feedback</a>
      </v-col>
    </v-footer>
</template>

<script>
export default {
  name: 'Footer',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  date () {
    return {
      windowWidth: window.innerWidth
    }
  },

  methods: {
    resizeHandler() {
      this.windowWidth = window.innerWidth
    },
  },
}
</script>

<style scoped>

.footer {
  font-family: 'Times New Roman', Times, serif;
}

a {
    margin-left: 10px;
    margin-right: 10px;
}
</style>