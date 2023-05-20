<template>
    <div class="modal-overlay" @click="close()">
        <div v-if="!showAddPlan" :class="windowWidth < '850' ? 'modal-sm' : 'modal'" @click.stop>
            <h6>Study Plans</h6>
            <v-divider />
            <div v-if="studyPlans.length !== 0">
              <v-list class="modal-list">
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
                        <v-icon @click="deletePlan(p.planid)">mdi-delete</v-icon>
                    </v-card-actions>
                </v-card>
                </v-list-item>
              </v-list>
            </div>
            <div class="modal-bottom-content">
                <v-btn text @click="$emit('close-modal')">
                    Exit
                </v-btn>
                <v-btn class="good-btn"
                    @click="windowWidth < '850' ? switchModals() : showAddPlan = true"
                >
                    Add Plan
                </v-btn>
            </div>
        </div>

        <!-- Add Plan Modal -->
        <div :class="windowWidth < '850' ? 'modal-sm' : 'modal'" 
            style="margin-left: 3px;" 
            v-if="showAddPlan" @click.stop
        >
            <h6>Add Plan</h6>
            <v-divider />
            <div class="eachRow">
                <v-btn color="light green lighten-2" @click="clearDate()">Date</v-btn>
                <input class="when text-center" v-if="this.date.length !== 0" :placeholder="this.date">
                <v-date-picker
                    v-if="showDate"
                    v-model="date"
                    elevation="6"
                    @click:date="prettyDate()"
                >
                </v-date-picker>
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
                <v-btn color="light yellow lighten-3" @click="clearTime()">Time</v-btn>
                <input class="when text-center" v-if="this.time.length !== 0" :placeholder="this.time">
            </div>
            <div class="eachRow">
                <h4>Study Duration (minutes)</h4>
                <input class="text-center" type="number" min="5" max="120" v-model="timeAmount">
            </div>
            <div class="eachRow">
                <h4>Priority Level</h4>
                <input class="text-center" type="number" max="5" min="1" v-model="priority">
            </div>
            <div style="margin-top: 70px">
                <v-btn text
                    @click="windowWidth < '850' ? switchModals() : showAddPlan = false"
                >
                    Exit
                </v-btn>
                <v-btn class="good-btn" @click="addPlan()">Save</v-btn>
            </div>
        </div>
    </div>
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
            date: "",
            time: "",
            timeAmount: 5,
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
                    this.close()
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
                this.showDate = true
            },
            
            clearTime () {
                this.time = ""
                this.showTime = true
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

.eachRow {
    margin-top: 25px;
}

.when {
    border: solid 1px;
    border-radius: 8px;
    margin-left: 15px;
    margin-top: 0;
    width: 125px;
    height: 30px;
    font-weight: bold;
    background-color: rgba(215, 236, 243, 0.781);
}

input {
    width: 50px;
    background-color: rgba(215, 236, 243, 0.781);
    border: solid 1px;
    border-radius: 8px;
    height: 30px;
    padding-left: 5px;
    margin-top: 10px;
}

</style>