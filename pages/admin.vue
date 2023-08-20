<template>
    <v-app>
      <span>
        <v-tabs class="tabs" background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}}
            </v-tab>
            <v-tab disabled class="admin-param" v-if="$route.params.user !== undefined">
              {{$route.params.user.firstname}} {{$route.params.user.lastname}}
            </v-tab>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item class="tab-data" v-for="item in items" :key="item.tab">
          <div class="table-list"
            style="height: auto;"
            v-if="tab === 0"
          > <!--users-->
          <table>
              <tr>
                <th style="width: 25%">Name</th>
                <th style="width: 35%">Email</th>
                <th style="width: 15%">Subscription</th>
                <th>Admin Status</th>
                <th>Remove User</th>
              </tr>
              <tr v-for="(u, i) in $route.query.userid === undefined ? adminUsers : adminUserData" :key="i">
                  <td v-if="$route.query.userid === undefined" @click="adminLoadOneUser(u)">
                    <nuxt-link :to="{ name: 'admin', query: { userid: u.userid }, params: { user: u }}">
                      {{u.firstname}} {{u.lastname}}
                    </nuxt-link>
                  </td>
                  <td v-else>
                    {{u.firstname}} {{u.lastname}}
                  </td>
                  <td>{{u.email}}</td>
                  <td>{{u.subscriptionstatus == 'active' ? 'Premium' : 'Basic'}}</td>
                  <td>
                    <v-btn
                      :class="u.isadmin ? 'bad-btn' : 'good-btn'"
                      @click="changeStatus(u)"
                    >
                      {{u.isadmin ? 'Demote' : 'Promote'}}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn
                      text
                      @click="deleteUser(u)"
                    >
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>
          </div>

          <div class="table-list"
            style="height: auto;"
            v-else-if="tab === 1"
          > <!--orgs-->
          <table>
              <tr>
                <th style="width: 50%">Name</th>
                <th>Private</th>
                <th v-if="$route.query.userid === undefined">Members</th>
                <th>{{$route.query.userid === undefined ? 'Status' : 'Remove User'}}</th>
              </tr>
              <tr v-for="(o, i) in $route.query.userid === undefined ? adminOrgs : adminUserOrgs" :key="i">
                  <td>
                    {{o.orgname}}
                  </td>
                  <td>
                    <input type="checkbox" :checked="o.isprivate" :value="o.isprivate" @click="togglePrivate(o)" />
                  </td>
                  <td v-if="$route.query.userid === undefined">
                    <v-btn
                      icon @click="loadOrgUsers(o)" 
                      :to="{ name: 'admin', query: { orgid: o.orgid }, params: { org: o }}"
                    >
                      {{o.members}}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn class="bad-btn"
                      @click="$route.query.userid === undefined ? deleteOrg(o) : removeUserFromOrg($route.params.user, o)"
                    >
                      {{$route.query.userid === undefined ? 'Delete' : 'Remove'}}
                    </v-btn>
                  </td>
              </tr>
          </table>
          </div>

          <div class="table-list"
            style="height: auto;"
            v-else-if="tab === 2"
          > <!--collections-->
          <table>
              <tr>
                <th style="width: 33%">Name</th>
                <th style="width: 30%">Organization</th>
                <th v-if="$route.query.userid === undefined" style="width: 26%">User</th>
                <th>Status</th>
              </tr>
              <tr v-for="(c, i) in $route.query.userid === undefined ? adminColls : adminUserColls" :key="i">
                  <td>
                    {{c.collectionname}}
                    <v-btn icon @click="loadCollNotes(c)">
                      ({{c.numnotes}})
                    </v-btn>
                  </td>
                  <td>{{c.orgname}}</td>
                  <td v-if="$route.query.userid === undefined" @click="adminLoadOneUser(c)">
                    <nuxt-link :to="{ name: 'admin', query: { userid: c.userid }, params: { user: c }}">
                      {{c.firstname}} {{c.lastname}}
                    </nuxt-link>
                  </td>
                  <td>
                    <v-btn class="bad-btn" @click="deleteColl(c)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>
          </div>

          <div class="table-list"
            style="height: auto;"
            v-else-if="tab === 3"
          > <!--notes-->
          <table>
              <tr>
                <th style="width: 31%">Name</th>
                <th style="width: 15%">Date</th>
                <th style="width: 22%">Collection</th>
                <th v-if="$route.query.userid === undefined" style="width: 22%">User</th>
                <th>Status</th>
              </tr>
              <tr v-for="(n, i) in $route.query.userid === undefined ? adminNotes : adminUserNotes" :key="i">
                  <td>{{n.notename}}</td>
                  <td>{{parseDate(n.notedate)}}</td>
                  <td>{{n.collectionname}}</td>
                  <td v-if="$route.query.userid === undefined" @click="adminLoadOneUser(n)">
                    <nuxt-link :to="{ name: 'admin', query: { userid: n.userid }, params: { user: n }}">
                      {{n.firstname}} {{n.lastname}}
                    </nuxt-link>
                  </td>
                  <td>
                    <v-btn class="bad-btn" @click="deleteNote(n)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>
          </div>

          <div class="email-section"
            v-else-if="tab === 4"
          >
            <center>
              <form class="email-form">
                <span class="basic-header">Send To: &ensp;</span>
                <v-menu
                  bottom
                  open-on-hover
                  close-on-content-click
                  transition="slide-y-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      class="basic-header"
                      style="font-size: 20px;"
                      v-on="on"
                      v-bind="attrs"
                    >
                      {{emailGroup}}
                      <v-icon>mdi-chevron-down</v-icon>
                      <span class="basic-header" style="font-size: 20px;">({{emailList.length}})</span>
                    </span>
                  </template>
                  <v-list>
                    <v-list-item @click="updateEmailGroup('All Users')" link>
                      <span>All Users</span>
                    </v-list-item>
                    <v-list-item @click="updateEmailGroup('Paid Users')" link>
                      <span>Paid Users</span>
                    </v-list-item>
                    <v-list-item @click="updateEmailGroup('Free Users')" link>
                      <span>Free Users</span>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <input class="email-field" v-model="subject" placeholder="Subject" />
                <v-textarea
                  class="email-field"
                  v-model="body"
                  placeholder="Email body"
                  clear-icon="mdi-eraser"
                  clearable
                ></v-textarea>
                <v-btn
                  class="good-btn"
                  @click="sendEmails()"
                  :disabled="emailList.length == 0 || subject == '' || body == ''"
                >
                  <v-icon color="#2F2B28">mdi-send</v-icon>
                  Send
                </v-btn>
              </form>
            </center>
          </div>
        </v-tab-item>
      </v-tabs-items>

      <!-- List of org users -->
      <v-dialog
        v-model="showOrgUsers"
        :width="windowWidth < 800 ? '90%' : '50%'"
      >
        <v-card class="dialog-card" elevation="5">
            <v-card-title class="basic-header justify-center" v-if="$route.params.org !== undefined">Members of {{$route.params.org.orgname}}</v-card-title>
            <v-divider style="margin-bottom: 10px;" />
            <v-card-text class="table-list">
              <table>
                <tr>
                  <th style="width: 35%">Name</th>
                  <th style="width: 45%">Email</th>
                  <th>Remove</th>
                </tr>
                <tr v-for="(m, i) in orgUsers" :key="i">
                    <td @click="adminLoadOneUser(m)">
                      <nuxt-link :to="{ name: 'admin', query: { userid: m.userid }, params: { user: m }}">
                        {{m.firstname}} {{m.lastname}}
                      </nuxt-link>
                    </td>
                    <td>{{m.email}}</td>
                    <td>
                      <v-btn class="bad-btn" @click="removeUserFromOrg(m, $route.params.org)">
                        Remove
                      </v-btn>
                    </td>
                </tr>
              </table>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="showOrgUsers = false">
                  Close
              </v-btn>
              <v-spacer />
            </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- List of coll notes -->
      <v-dialog
        v-model="showCollNotes"
        :width="windowWidth < 800 ? '90%' : '50%'"
      >
        <v-card class="dialog-card" elevation="5">
            <v-card-title class="basic-header justify-center" v-if="collOpened !== {}">Notes in {{collOpened.collectionname}}</v-card-title>
            <v-divider style="margin-bottom: 10px;" />
            <v-card-text class="table-list">
              <table>
                <tr>
                  <th style="width: 35%">Name</th>
                  <th style="width: 45%">Date</th>
                  <th>Delete</th>
                </tr>
                <tr v-for="(n, i) in collNotes" :key="i">
                    <td>{{n.notename}}</td>
                    <td>{{parseDate(n.notedate)}}</td>
                    <td>
                      <v-btn class="bad-btn" @click="deleteNote(n)">
                        Delete
                      </v-btn>
                    </td>
                </tr>
              </table>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="showCollNotes = false">
                  Close
              </v-btn>
              <v-spacer />
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'AdminPage',
  middleware: ["auth", "admin"],

  async updated () {
    if (this.$route.query.userid != undefined && this.$route.params.user != undefined) {
      await this.$store.dispatch('users/adminLoadOneUser', { userid: this.$route.query.userid })
    }
  },

  async created () {
    await this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    await this.$store.dispatch('users/adminLoadUsers')
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'users' },
        { tab: 'organizations' },
        { tab: 'collections' },
        { tab: 'notes' },
        { tab: 'emails' },
      ],
      showOrgUsers: false,
      showCollNotes: false,
      collOpened: {},
      subject: '',
      body: '',
      emailGroup: 'Select',
      windowWidth: window.innerWidth
    }
  },

  methods: {
    async updateEmailGroup(group) {
      this.emailGroup = group
      await this.$store.dispatch('users/getEmailList', {
        group: this.emailGroup
      })
    },

    async sendEmails() {
      if (confirm(`Are you ready to email ${this.emailList.length} users?`)) {
        const body= {
          'emails': this.emailList,
          'subject': this.subject,
          'body': this.body
        }
        await fetch(process.env.NUXT_ENV_EMAIL_WEBHOOK, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Type': 'admin-email'
          },
          body: JSON.stringify(body)
        })
        this.subject = ''
        this.body = ''
        this.emailGroup = 'Select'
        await this.$store.commit('setEmailList', [])
      }
    },

    togglePrivate(org) {
      this.$store.dispatch('users/toggleOrg', {
        orgid: org.orgid,
        isPrivate: !org.isprivate
      })
    },

    adminLoadOneUser (u) {
      this.showOrgUsers = false
      this.$store.dispatch('users/adminLoadOneUser', {
        userid: u.userid
      })
    },

    loadOrgUsers (o) {
      this.showOrgUsers = true
      this.$store.dispatch('users/loadOrgUsers', {
        orgid: o.orgid
      })
    },

    loadCollNotes(c) {
      this.collOpened = c
      this.showCollNotes = true
      this.$store.dispatch('users/loadCollNotes', {
        collectionid: c.collectionid
      })
    },

    changeStatus (u) {
      this.$store.dispatch('users/toggleAdmin', {
        userid: u.userid,
        isadmin: !u.isadmin
      })
    },

    deleteUser(user) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.$store.dispatch('users/deleteUser', {
          userid: user.userid
        })
      }
    },

    deleteOrg (org) {
      if (confirm(`Are you sure you want to delete ${org.orgname}? All members of ${org.orgname} will be removed, and all collections and notes in it will be deleted.`)) {
        this.$store.dispatch('users/deleteOrg', {
          orgid: org.orgid
        })
      }
    },

    removeUserFromOrg(m, org) {
      if (confirm(`Are you sure you want to remove ${m.firstname} from ${org.orgname}? They will lose access to all collections and notes they have in this organization.`)) {
        this.$store.dispatch('users/removeFromOrg', {
          userid: m.userid,
          orgid: org.orgid
        })
      }
    },

    deleteNote(n) {
      if (confirm(`Are you sure you want to delete ${n.notename}? All flashcards, links, files, whiteboards, and study plans will also be deleted.`)) {
        this.$store.dispatch('users/deleteNote', {
          noteid: n.noteid
        })
      }
    },

    parseDate(date) {
      let prettyDate = ""
      const yearMonth = date.split('-')
      let day = yearMonth[2].split('T')
      prettyDate += yearMonth[1] + " / " + day[0] + " / " + yearMonth[0]
      return prettyDate
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    adminUsers () {
      return this.$store.state.users.adminUsers
    },

    adminOrgs () {
      return this.$store.state.users.adminOrgs
    },

    adminColls () {
      return this.$store.state.users.adminColls
    },

    adminNotes () {
      return this.$store.state.users.adminNotes
    },

    adminUserData () {
      return this.$store.state.users.adminUserData
    },

    adminUserOrgs () {
      return this.$store.state.users.adminUserOrgs
    },

    adminUserColls () {
      return this.$store.state.users.adminUserColls
    },

    adminUserNotes () {
      return this.$store.state.users.adminUserNotes
    },

    orgUsers () {
      return this.$store.state.users.orgUsers
    },

    collNotes () {
      return this.$store.state.users.collNotes
    },

    emailList () {
      return this.$store.state.users.emailList
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.tabs {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.tab-data {
  background-color: #f9f9f9 !important;
}

.modal {
  width: 650px;
}

h6 {
  font-family: 'Times New Roman', Times, serif;
  font-weight: 500;
  font-size: 28px;
}

.table-list {
  height: 370px;
  overflow: scroll;
}

.email-section {
  margin: 20px;
}

.email-form {
  width: 50%;
}

.email-field {
  padding: 8px;
  border: solid 1px #2F2B28;
  border-radius: 10px;
  width: 100%;
}

.good-btn {
  margin: 5px;
}

tr:nth-child(odd) {
  background-color: #dfdfdf;
}

.modal-bottom-content {
  top: 12px;
}

.admin-param {
  font-family: 'Times New Roman', Times, serif;
  font-weight: bold;
}

.good-btn {
  font-size: 14px !important;
  font-family: 'Times New Roman', Times, serif;
}

</style>
