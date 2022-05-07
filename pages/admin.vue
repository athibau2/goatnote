<template>
    <v-app>
      <span>
        <v-tabs background-color="transparent" left v-model="tab">
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
        <v-tab-item v-for="item in items" :key="item.tab">
          <table v-if="tab === 0"> <!--users-->
              <tr>
                <th style="width: 28%">Name</th>
                <th style="width: 40%">Email</th>
                <th>Admin Status</th>
                <th>Remove User</th>
              </tr>
              <tr v-for="(u, i) in $route.query.userid === undefined ? adminUsers : adminUserData" :key="i">
                  <td v-if="$route.query.userid === undefined" @click="loadAdminUserData(u)">
                    <nuxt-link :to="{ name: 'admin', query: { userid: u.userid }, params: { user: u }}">
                      {{u.firstname}} {{u.lastname}}
                    </nuxt-link>
                  </td>
                  <td v-else>
                    {{u.firstname}} {{u.lastname}}
                  </td>
                  <td>{{u.email}}</td>
                  <td>
                    <v-btn
                      :color="u.isadmin ? 'light red lighten-2' : 'primary'"
                      @click="changeStatus(u)"
                    >
                      {{u.isadmin ? 'Demote' : 'Promote'}}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn
                      :color="'grey'"
                      @click="deleteUser(u)"
                    >
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>

          <table v-else-if="tab === 1"> <!--orgs-->
              <tr>
                <th style="width: 50%">Name</th>
                <th>Members</th>
                <th>Status</th>
              </tr>
              <tr v-for="(o, i) in $route.query.userid === undefined ? adminOrgs : adminUserOrgs" :key="i">
                  <td>
                    {{o.orgname}}
                  </td>
                  <td>
                    <v-btn
                      icon @click="loadOrgUsers(o)" 
                      :to="{ name: 'admin', query: { orgid: o.orgid }, params: { org: o }}"
                    >
                      {{o.members}}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn color="light red lighten-2" @click="deleteOrg(o)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>

          <table v-else-if="tab === 2"> <!--collections-->
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
              <tr v-for="(c, i) in $route.query.userid === undefined ? adminColls : adminUserColls" :key="i">
                  <td>{{c.collectionname}}</td>
                  <td>
                    <v-btn color="light red lighten-2" @click="deleteColl(c)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>

          <table v-else-if="tab === 3"> <!--notes-->
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
              <tr v-for="(n, i) in $route.query.userid === undefined ? adminNotes : adminUserNotes" :key="i">
                  <td>{{n.notename}}</td>
                  <td>
                    <v-btn color="light red lighten-2" @click="deleteNote(n)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>
        </v-tab-item>
      </v-tabs-items>

      <!-- List of org users -->
      <div class="modal-overlay" v-if="showOrgUsers" @click="showOrgUsers = false">
        <div class="modal" @click.stop>
            <h6>Members of {{$route.params.org.orgname}}</h6>
            <v-divider />
            <div class="table-list">
              <table>
                <tr>
                  <th style="width: 35%">Name</th>
                  <th style="width: 45%">Email</th>
                  <th>Remove</th>
                </tr>
                <tr v-for="(m, i) in orgUsers" :key="i">
                    <td>{{m.firstname}} {{m.lastname}}</td>
                    <td>{{m.email}}</td>
                    <td>
                      <v-btn color="light red lighten-2" @click="removeUserFromOrg(m, $route.params.org.orgname)">
                        Remove
                      </v-btn>
                    </td>
                </tr>
              </table>
            </div>
            <div class="modal-bottom-content">
                <v-btn color="light red lighten-2" @click="showOrgUsers = false">
                    Exit
                </v-btn>
            </div>
        </div>
      </div>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'AdminPage',
  middleware: ["auth", "admin"],

  async updated () {
    await this.$store.dispatch('users/loadAdminUserData', { userid: this.$route.query.userid })
  },

  async mounted () {
    await this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    await this.$store.dispatch('users/loadAdminData')
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'users' },
        { tab: 'organizations' },
        { tab: 'collections' },
        { tab: 'notes' },
      ],
      showOrgUsers: false,
    }
  },

  methods: {
    loadAdminUserData (u) {
      this.$store.dispatch('users/loadAdminUserData', {
        userid: u.userid
      })
    },

    loadOrgUsers (o) {
      this.showOrgUsers = true
      this.$store.dispatch('users/loadOrgUsers', {
        orgid: o.orgid
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

    removeUserFromOrg(m, orgname) {
      if (confirm(`Are you sure you want to remove ${m.firstname} from ${orgname}? They will lose access to all collections and notes they have in this organization.`)) {
        // call remove from org
      }
    },
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
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.modal {
  width: 600px;
}

h6 {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: 500;
  font-size: 28px;
}

.table-list {
  height: 370px;
  overflow: auto;
}

tr:nth-child(odd) {
    background-color: #dfdfdf;
}

.modal-bottom-content {
  top: 12px;
}

.admin-param {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-weight: bold;
}

</style>
