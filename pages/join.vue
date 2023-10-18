<template>
  <v-app>
      <span>
        <v-tabs background-color="transparent" left v-model="tab">
          <v-tabs-slider></v-tabs-slider>
            <v-tab v-for="item in items" :key="item.tab">
              {{item.tab}} {{item.tab === 'public' ? '('+publicOrgs.length+')' : ''}}
            </v-tab>
            <v-text-field
              class="search-bar"
              dense
              solo
              rounded
              background-color="#f9f9f9"
              v-model="searchText"
              :placeholder="tab == 0 ? 'Find by name' : 'Find by join code'"
              append-icon="mdi-magnify"
              @keyup.enter="searchOrg()"
              @input="tab == 0 ? searchOrg() : null"
            >
            </v-text-field>
        </v-tabs>
      </span>
      <v-tabs-items v-model="tab">
        <v-tab-item class="public-list" v-for="item in items" :key="item.tab">
          <!-- List of public orgs -->
          <v-col v-if="tab === 0">
            <Loading v-if="publicOrgs.length == 0" />
            <v-row>
              <v-card class="card"
                elevation="5"
                width="250"
                v-for="(org, i) in searchingPublic ? filteredPublicArr : publicOrgs"
                :key="i"
              >
                <v-card-title>
                  {{org.orgname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{org.members}} {{org.members > 1 ? 'Members' : 'Member'}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="good-btn" @click="joinOrg(org)">Join</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>

          <!-- Search for private org -->
          <v-col v-else-if="tab === 1">
            <v-row v-if="foundOrg !== null">
              <v-card class="card" elevation="5" width="250">
                <v-card-title>
                  {{foundOrg.orgname}}
                </v-card-title>
                <v-card-subtitle>
                  <em>{{foundOrg.members}} {{foundOrg.members > 1 ? 'Members' : 'Member'}}</em>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer />
                  <v-btn class="good-btn" @click="joinOrg(foundOrg)">Join</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-tab-item>
      </v-tabs-items>
    </v-app>
</template>

<script>
import Loading from '~/components/Loading.vue'
export default {
  name: 'JoinOrgPage',

  components: {
    Loading
  },

  head() {
    return {
      title: 'Join Organization - GOAT Notes',
      meta: [
        { hid: 'join-org-description', name: 'description', content: 'Find an organization to join in GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, organization' }
      ]
    }
  },

  async mounted () {
    await this.$store.dispatch('users/loadPublicOrgs')
    if (this.$route.params.new) {
      await this.$store.commit('users/setAlert', {
        color: 'info',
        icon: '$info',
        text: 'Join your organization here so you can collaborate with your peers, or search it with the join code. If it doesn\'t exist, create a new one.'
      })
    }
  },

  data () {
    return {
      tab: null,
      items: [
        { tab: 'public' },
        { tab: 'private' },
      ],
      searchText: "",
      filteredPublicArr: []
    }
  },

  methods: {
    async searchOrg() {
      if (this.tab == 0) {
        if (this.searchText != '') {
          this.searchingPublic = true
          this.filteredPublicArr = this.publicOrgs.filter(org => org.orgname.toLowerCase().includes(this.searchText))
        } else if (this.searchText == '') this.searchingPublic = false
      } else if (this.tab == 1) {
        await this.$store.dispatch('users/searchOrg', {
          searchText: this.searchText,
        })
      }
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
  background-color: #f9f9f9;
  padding-bottom: 10px;
}

.search-bar {
  max-width: 40%;
  margin-top: 5px;
  margin-left: 30px;
}

</style>
