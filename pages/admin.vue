<template>
    <v-app>
      <span>
        <v-tabs background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}}
            </v-tab>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <table v-if="tab === 0"> <!--users-->
              <tr>
                <td>Name</td>
                <td>Email</td>
                <td>Account Type</td>
                <td>Status</td>
              </tr>
              <tr v-for="(u, i) in adminUsers" :key="i">
                  <td>{{u.firstname}} {{u.lastname}}</td>
                  <td>{{u.email}}</td>
                  <td>{{u.isadmin ? 'Admin' : 'User'}}</td>
                  <td>
                    <v-btn
                      :color="u.isadmin ? 'light red lighten-2' : 'primary'"
                      @click="changeStatus(u)"
                    >
                      {{u.isadmin ? 'Demote' : 'Promote'}}
                    </v-btn>
                  </td>
              </tr>
          </table>
          <table v-else-if="tab === 1"> <!--orgs-->
              <tr>
                <td>Name</td>
                <td>Status</td>
              </tr>
              <tr v-for="(o, i) in adminOrgs" :key="i">
                  <td>{{o.orgname}}</td>
                  <td>
                    <v-btn color="light red lighten-2" @click="deleteOrg(o)">
                      Delete
                    </v-btn>
                  </td>
              </tr>
          </table>
          <table v-else-if="tab === 2"> <!--collections-->
              <tr>
                <td>Name</td>
                <td>Status</td>
              </tr>
              <tr v-for="(c, i) in adminColls" :key="i">
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
                <td>Name</td>
                <td>Status</td>
              </tr>
              <tr v-for="(n, i) in adminNotes" :key="i">
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
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'AdminPage',
  middleware: ["auth", "admin"],

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
    }
  },

  methods: {
    changeStatus (u) {
      this.$store.dispatch('users/toggleAdmin', {
        userid: u.userid,
        isadmin: !u.isadmin
      })
    },

    deleteOrg (org) {
      // call delete org
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
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

tr:nth-child(odd) {
    background-color: #dfdfdf;
}


</style>
