<template>
    <v-app>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4644384223616162" crossorigin="anonymous"></script>

        <span>
        <v-tabs background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}} {{item.tab === 'public' ? '('+publicOrgs.length+')' : ''}}
            </v-tab>
            <v-text-field
              v-if="tab === 1"
              class="search-bar"
              dense
              solo
              rounded
              background-color="light blue lighten-4"
              v-model="searchText"
              placeholder="Find by join code"
              append-icon="mdi-magnify"
              @keyup.enter="searchOrg()"
            >
            </v-text-field>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item class="public-list" v-for="item in items" :key="item.tab">
          <!-- List of public orgs -->
          <v-col v-if="tab === 0">
            <v-row>
              <v-card class="list-card" color="light blue lighten-4" elevation="5" width="250" v-for="(org, i) in publicOrgs" :key="i">
                <v-card-title>
                  {{org.orgname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{org.members}} {{org.members > 1 ? 'Members' : 'Member'}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="light green lighten-3" @click="joinOrg(org)">Join</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>

          <!-- Search for private org -->
          <v-col v-else-if="tab === 1">
            <v-row v-if="foundOrg !== null">
              <v-card class="list-card" color="light blue lighten-4" elevation="5" width="250">
                <v-card-title>
                  {{foundOrg.orgname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{foundOrg.members}} {{foundOrg.members > 1 ? 'Members' : 'Member'}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="light green lighten-3" @click="joinOrg(foundOrg)">Join</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'JoinOrgPage',
  middleware: "auth",

  async mounted () {
    await this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    await this.$store.dispatch('users/loadPublicOrgs')
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'public' },
        { tab: 'search' },
      ],
      searchText: "",
    }
  },

  methods: {
    searchOrg() {
      this.$store.dispatch('users/searchOrg', {
        searchText: this.searchText,
      })
    },

    joinOrg(org) {
      if (confirm(`You wish to join ${org.orgname}?`)){
        this.$store.dispatch('users/joinOrg', {
          orgid: org.orgid
        })
      }
    },
  },

  computed: {
    publicOrgs () {
      return this.$store.state.users.publicOrgs
    },

    foundOrg () {
      return this.$store.state.users.foundOrg
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.public-list {
  background-color: #DAECDA;
  padding-bottom: 10px;
}

.list-card {
  margin-right: 10px;
  margin-top: 10px;
}

.search-bar {
  max-width: 40%;
  margin-top: 5px;
  margin-left: 30px;
}

</style>
