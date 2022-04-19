<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" class="modal" @click.stop>
            <h6>Links</h6>
            <v-divider />
            <div v-if="links.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(link, i) in links" :key="i">
                  <span class="modal-list-item">
                      {{link.url}}&nbsp;
                      <v-icon @click="deleteLink(link.linkid)">mdi-delete</v-icon>
                      <v-divider />
                  </span>
                </v-list-item>
              </v-list>
            </div>
            <div class="modal-bottom-content-2">
              <v-row>
                <v-text-field 
                  v-model="newLink" 
                  placeholder="Enter New Link"
                >
                </v-text-field>
              </v-row>
              <div class="modal-bottom-content-3">
                <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn color="primary" @click="addLink()">Add</v-btn>
              </div>
            </div>
        </div>

        <div v-else class="modal" @click.stop>
            <h6>Links</h6>
            <v-divider />
            <div v-if="links.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(link, i) in links" :key="i">
                  <span class="modal-list-item">
                      <a @click="launchUrl(link.url)">{{link.url}}</a>
                      <v-divider />
                  </span>
                </v-list-item>
              </v-list>
            </div>
            <br>
            <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                Exit
            </v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "LinksComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
        this.$store.commit('users/study', localStorage.getItem('studyMode'))
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
          this.$store.dispatch('users/addLink', {
            url: this.newLink,
            noteid: this.currentNote.noteid
          })
          this.newLink = ""
        },

        launchUrl (url) {
          window.open(url)
        }
      },

      computed: {
          studyMode () {
            return this.$store.state.users.studyMode
          },

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
@import '~/assets/styles.css';

h6 {
  font-weight: 500;
  font-size: 28px;
}

p {
  font-size: 16px;
  margin: 10px 15px;
}

/* .link {
  overflow-wrap: break-word;
} */

</style>