<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Links</h6>
            <v-divider />
            <span v-for="(link, i) in links" :key="i">
                {{link.url}}&nbsp;
                <v-icon @click="deleteLink(link.linkid)">mdi-delete</v-icon>
                <v-divider />
            </span>
            <br>
            <p>
              <v-row>
                <v-text-field 
                  v-model="newLink" 
                  placeholder="Enter New Link"
                >
                </v-text-field>
              </v-row>
            </p>
            <v-btn @click="$emit('close-modal')">
                Exit
            </v-btn>
            <v-btn @click="addLink()">Add</v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "LinksComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
      },

      data () {
        return {
          newLink: ""
        }
      },

      methods: {
        deleteLink (linkid) {
          this.$store.dispatch('users/deleteLink', {
            linkid: linkid,
            noteid: this.currentNote.noteid
          })
        },

        addLink () {
          console.log(this.newLink)
          this.$store.dispatch('users/addLink', {
            url: this.newLink,
            noteid: this.currentNote.noteid
          })
          this.newLink = ""
        }
      },

      computed: {
          links () {
              return this.$store.state.users.links
          },

          currentNote () {
            return this.$store.state.users.currentNote
          },
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
  margin: 10px 15px;
}

</style>