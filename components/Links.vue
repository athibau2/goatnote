<template>
    <v-card class="dialog-card" elevation="5">
        <div v-if="!studyMode">
          <v-card-text>
            <v-list class="modal-list" v-if="links.length !== 0">
              <v-list-item v-for="(link, i) in links" :key="i">
                <div class="modal-list-item" v-if="!editingLink || (editingLink && link.linkid !== linkBeingEdited)">
                    <v-row style="padding: 15px 5px;">
                      <span style="max-width: 80%;">{{link.url}}</span>
                      <v-spacer />
                      <span>
                        <v-btn
                          :disabled="(editingLink && link.linkid !== linkBeingEdited) ? true : false" 
                          icon @click="setEditLink(link)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn @click="deleteLink(link.linkid)" icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </span>
                    </v-row>
                    <v-divider />
                </div>
                <v-row align="center" justify="center" v-else>
                  <v-text-field
                    :value="link.url"
                    append-icon="mdi-pencil"
                    @click:append="editingLink = !editingLink"
                    @input="linkChanged($event)"
                    @keyup.enter="updateLink(link)"
                  >
                  </v-text-field>
                </v-row>
              </v-list-item>
            </v-list>
            <div>
              <v-text-field
                class="text-field"
                v-model="newLink" 
                placeholder="Enter New Link"
                @keyup.enter="addLink()"
              >
              </v-text-field>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="flat-btn" @click="close()" text>
                Close
            </v-btn>
            <v-btn class="good-btn" @click="addLink()">Add</v-btn>
            <v-spacer />
          </v-card-actions>
        </div>

        <div v-else>
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
            <v-card-actions>
              <v-spacer />
              <v-btn class="flat-btn" @click="close()" text>
                  Close
              </v-btn>
              <v-spacer />
          </v-card-actions>
        </div>
    </v-card>
</template>

<script>
  export default {
      name: "LinksComponent",

      created () {
        window.addEventListener('resize', this.resizeHandler)
      },

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/links', JSON.parse(localStorage.getItem('links')))
      },

      data () {
        return {
          newLink: "",
          editingLink: false,
          linkBeingEdited: null,
          editLink: "",
          windowWidth: window.innerWidth,
        }
      },

      methods: {
        resizeHandler() {
          this.windowWidth = window.innerWidth
        },

        linkChanged (event) {
          this.editLink = event
        },

        setEditLink (link) {
          this.editingLink = !this.editingLink
          if (this.editingLink) {
            this.linkBeingEdited = link.linkid
            this.linkChanged(link.url)
          }
          else this.linkBeingEdited = null
        },

        async updateLink (link) {
          await this.$store.dispatch('users/updateLink', {
            linkid: link.linkid,
            editLink: this.editLink,
            noteid: link.noteid
          })
          this.setEditLink()
        },

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
        },

        async close() {
          this.newLink = ""
          await this.$store.commit('users/setShowStudyTools', false)
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

.modal-sm {
  text-align: center;
  background-color: white;
  height: 475px;
  width: 400px;
  margin-top: 15%;
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

.text-field {
  width: 95%;
  display: flex;
  margin: auto;
}

/* .link {
  overflow-wrap: break-word;
} */

</style>