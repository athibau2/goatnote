<template>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4644384223616162"crossorigin="anonymous"></script>
    <v-app>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4644384223616162" crossorigin="anonymous"></script>
      
      <v-container>
        <h2 v-if="allPlans.length === 0" class="notice text-center">
          You currently do not have any study plans set up for any of your notes.
        </h2>
        <div v-else-if="allPlans.length > 0">
          <v-row justify="center" align="center">
            <h2 class="notice text-center">Uncompleted Study Plans</h2>
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
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="openNote(p.noteid)"
                        >
                          <v-icon>mdi-chevron-right-circle</v-icon>
                        </v-btn>
                      </template>
                      <span>Go Study</span>
                    </v-tooltip>
                </v-card-actions>
            </v-card>
          </v-row>
        </div>
      </v-container>
    </v-app>
</template>

<script>
import { getJwtToken, getUserIdFromToken } from "../store/auth"
export default {
  name: 'PlansPage',
  middleware: "auth",

  mounted () {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/getAllPlans')
  },

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  data () {
    return {
      windowWidth: window.innerWidth
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

    openNote (noteid) {
      this.$store.dispatch('users/openNote', {
        noteid
      })
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
