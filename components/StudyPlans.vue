<template>
    <v-card class="dialog-card" elevation="5">
        <div class="text-center">
            <v-btn-toggle
                v-model="toggle"
                rounded
                dense
            >
                <v-btn>My Plans</v-btn>
                <v-btn>New Plan</v-btn>
            </v-btn-toggle>
        </div>
        <div class="text-center" v-if="toggle == 0">
            <v-card-text>
              <span class="notice" v-if="studyPlans.length == 0">
                This note currently has no study plans
              </span>
              <v-list class="modal-list" v-if="studyPlans.length !== 0">
                <v-list-item v-for="(p, i) in studyPlans" :key="i">
                <v-card height="190px" class="modal-list-item" elevation="2" color="#fcfcfc" flat>
                    <table>
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
                        <v-switch
                            :label="p.studycompleted ? 'Completed' : 'Not Completed'"
                            inset
                            :value="p.studycompleted"
                            @click="updatePlan(p)"
                        >
                        </v-switch>
                        <v-spacer />
                        <v-btn @click="deletePlan(p.planid)" icon>
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn class="flat-btn" text @click="close()">
                    Close
                </v-btn>
                <v-spacer />
            </v-card-actions>
        </div>

        <!-- Add Plan Modal -->
        <div class="text-center"
            v-if="toggle == 1"
        >
            <v-card-text>
                <div class="eachRow">
                    <v-btn class="good-btn" @click="clearDate()">{{showDate ? 'Close' : 'Set Date'}}</v-btn>
                    <span class="basic-header text-center" v-if="this.date.length !== 0">{{this.date}}</span>
                    <v-date-picker
                        v-if="showDate"
                        v-model="date"
                        elevation="6"
                        @click:date="prettyDate()"
                    >
                    </v-date-picker>
                </div>
                <div class="eachRow">
                    <v-btn class="good-btn" @click="clearTime()">{{showTime ? 'Close' : 'Set Time'}}</v-btn>
                    <span class="basic-header text-center" v-if="this.time.length !== 0">{{this.time}}</span>
                    <v-time-picker
                        v-if="showTime"
                        v-model="time"
                        elevation="6"
                        :landscape="$vuetify.breakpoint.smAndUp"                    
                    >
                        <v-btn
                            text
                            color="primary"
                            @click="prettyTime()"
                        >
                            OK
                        </v-btn>
                    </v-time-picker>
                </div>
                <div class="eachRow">
                    <span class="basic-header">Set Duration (minutes)</span>
                    <input class="text-center" type="number" step="10" min="10" max="120" v-model="timeAmount">
                </div>
                <div class="eachRow">
                    <span class="basic-header">Set Priority Level</span>
                    <input class="text-center" type="number" max="5" min="1" v-model="priority">
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn class="flat-btn" text @click="close()">
                    Close
                </v-btn>
                <v-btn class="good-btn" @click="addPlan()">Save</v-btn>
                <v-spacer />
            </v-card-actions>
        </div>
    </v-card>
</template>

<script>
  export default {
      name: "StudyPlansComponent",

      created () {
        window.addEventListener('resize', this.resizeHandler)
        this.showPlans = true
      },

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
        this.$store.commit('users/studyPlans', JSON.parse(localStorage.getItem('studyPlans')))
      },

      data () {
        return {
            toggle: 0,
            date: "",
            time: "",
            timeAmount: 10,
            priority: 1,
            plans: JSON.parse(localStorage.getItem('studyPlans')),
            showDate: false,
            showTime: false,
            showAddPlan: false,
            showPlans: false,
            windowWidth: window.innerWidth,
        }
      },

      methods: {
            resizeHandler() {
                this.windowWidth = window.innerWidth
            },

            switchModals() {
                this.showPlans = !this.showPlans
                this.showAddPlan = !this.showAddPlan
            },

            close () {
                this.showAddPlan = false
                this.showPlans = false
                this.date = ""
                this.time = ""
                this.timeAmount = 5
                this.priority = 1
                this.$emit('close-modal')
            },

            async updatePlan(p) {
                await this.$store.dispatch('users/updatePlan', {
                    planid: p.planid,
                    completed: !p.studycompleted,
                    noteid: this.currentNote.noteid
                })
            },

            async addPlan () {
                if (this.studyPlans.length === 3) {
                    alert('You can only have up to 3 study plans for each note. Please delete an old plan and try again')
                    this.showAddPlan = false
                } else {
                    await this.$store.dispatch('users/addPlan', {
                        date: this.date,
                        time: this.time,
                        amount: this.timeAmount,
                        priority: this.priority,
                        noteid: this.currentNote.noteid
                    })
                    this.date = ""
                    this.time = ""
                    this.toggle = 0
                }
            },

            async deletePlan (planid) {
                await this.$store.dispatch('users/deletePlan', {
                    planid: planid,
                    noteid: this.currentNote.noteid
                })
            },

            prettyDate () {
                this.showDate = false
                this.date = this.date.split('-')
                this.date = this.date[1] + ' / ' + this.date[2] + ' / ' + this.date[0]
            },

            prettyTime () {
                this.showTime = false
                let hour = this.time[0] + this.time[1]
                let timeOfDay = " AM"
                if (parseInt(hour) > 12) {
                    timeOfDay = " PM"
                    hour -= 12
                    hour.toString()
                    this.time = hour + this.time[2] + this.time[3] + this.time[4] + timeOfDay
                }
            },

            clearDate () {
                this.date = ""
                this.showDate = !this.showDate
            },
            
            clearTime () {
                this.time = ""
                this.showTime = !this.showTime
            },

            async close() {
                this.date = ""
                this.time = ""
                await this.$store.commit('users/setShowStudyTools', false)
            }
      },

      computed: {
          currentNote () {
            return this.$store.state.users.currentNote
          },

          studyPlans () {
              return this.$store.state.users.studyPlans
          }
      }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.eachRow {
    margin-bottom: 20px;
}

.basic-header {
    font-size: 20px;
    margin-left: 10px;
}

input {
    margin-left: 10px;
    font-size: 16px;
    border: solid 1px;
    border-radius: 10px;
    padding: 3px;
}

</style>