<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Links</h6>
            <p v-for="(link, i) in links" :key="i">
                {{link.url}}
            </p>
            <v-btn @click="$emit('close-modal')">
                Cancel
            </v-btn>
            <v-btn>Add</v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "LinksComponent",

      computed: {
          links () {
              return this.$store.state.users.links
          }
      }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 400px;
  width: 500px;
  margin-top: 10%;
  padding: 0px 0;
  border-radius: 20px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

</style>