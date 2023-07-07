<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div v-if="!studyMode" :class="windowWidth < '850' ? 'modal-sm' : 'modal'" @click.stop>
            <h6>Links</h6>
            <v-divider />
            <div v-if="links.length !== 0">
              <v-list class="modal-list">
                <v-list-item v-for="(link, i) in links" :key="i">
                  <span class="modal-list-item" v-if="!editingLink || (editingLink && link.linkid !== linkBeingEdited)">
                      {{link.url}}&nbsp;
                      <v-btn 
                        :disabled="(editingLink && link.linkid !== linkBeingEdited) ? true : false" 
                        icon @click="setEditLink(link)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-icon @click="deleteLink(link.linkid)">mdi-delete</v-icon>
                      <v-divider />
                  </span>
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
            </div>
            <div class="modal-bottom-content-2">
              <v-row>
                <v-text-field 
                  v-model="newLink" 
                  placeholder="Enter New Link"
                  @keyup.enter="addLink()"
                >
                </v-text-field>
              </v-row>
              <div class="modal-bottom-content-3">
                <v-btn text @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn class="good-btn" @click="addLink()">Add</v-btn>
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
            <v-btn text @click="$emit('close-modal')">
                Exit
            </v-btn>
        </div>
    </div>
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
        this.$store.commit('users/study', localStorage.getItem('studyMode'))
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

/* .link {
  overflow-wrap: break-word;
} */

</style>