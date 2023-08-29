<template>
    <v-app>
        <span v-if="allPlans.length === 0" class="notice text-center">
          You currently do not have any study plans set up for any of your notes.
        </span>
        <Loading v-if="allPlans.length == 0" />
        <div v-else-if="allPlans.length > 0">
          <v-row justify="center" align="center">
            <span class="notice text-center">Uncompleted Study Plans</span>
          </v-row>
          <v-row justify="center" align="center" style="margin-top: 20px;">
            <v-card class="modal-list-item" :style="windowWidth < 850 ? 'width: 200px' : null" 
              v-for="(p, i) in allPlans" :key="i" elevation="2" flat
            >
                <table>
                    <tr>
                        <td>Note:</td>
                        <td>{{p.notename}}</td>
                    </tr>
                    <tr>
                        <td>Date:</td>
                        <td>{{p.studydate}}</td>
                    </tr>
                    <tr>
                        <td>Time:</td>
                        <td>{{p.time}}</td>
                    </tr>
                    <tr>
                        <td>Duration:</td>
                        <td>{{p.timeamount}} minutes</td>
                    </tr>
                    <tr>
                        <td>Priority Level:</td>
                        <td>{{p.prioritylevel}} / 5</td>
                    </tr>
                </table>
                <v-card-actions>
                    <v-spacer />
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="deletePlan(p.planid)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Plan</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="!loading || selected != i">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="openNote(p.noteid, i)"
                          :disabled="loading"
                        >
                          <v-icon>mdi-chevron-right-circle</v-icon>
                        </v-btn>
                      </template>
                      <span>Study</span>
                    </v-tooltip>
                    <Loading v-if="loading && selected == i" />
                </v-card-actions>
            </v-card>
          </v-row>
        </div>
    </v-app>
</template>

<script>
import Loading from '~/components/Loading.vue'
export default {
  name: 'PlansPage',

  head() {
    return {
      title: 'Study Plans - GOAT Notes',
      meta: [
        { hid: 'plans-description', name: 'description', content: 'See all your study plans in GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, plans, reminder' }
      ]
    }
  },

  mounted () {
    this.$store.dispatch('users/getAllPlans')
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  components: {
    Loading,
  },

  data () {
    return {
      windowWidth: window.innerWidth,
      loading: false,
      selected: null,
    }
  },

  methods: {
    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    async deletePlan (planid) {
        await this.$store.dispatch('users/deletePlan', {
            planid: planid,
            noteid: null
        })
    },

    async openNote (noteid, i) {
      this.selected = i
      this.loading = true
      await this.$store.dispatch('users/openNote', {
        noteid
      })
      this.loading = false
    },
  },

  computed: {
    allPlans () {
      return this.$store.state.users.allPlans
    }

  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.modal-list-item {
  margin-right: 2%;
  width: 30%;
  background-color: #fcfcfc;
}

</style>
