<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal" @click.stop>
            <h6>Study Plan</h6>
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
                <h4>Study Time Amount (minutes)</h4>
                <input class="text-center" type="number" min="5" max="120" v-model="timeAmount">
            </div>
            <div class="eachRow">
                <h4>Priority Level</h4>
                <input class="text-center" type="number" max="5" min="1" v-model="priority">
            </div>
            <div class="eachRow">
                <h4>Completed</h4>
                <v-layout row wrap justify-center>
                  <v-switch
                    inset 
                    v-model="completed" 
                    @click="completed = !completed"
                  >
                  </v-switch>
                </v-layout>
            </div>
            <br>
            <v-btn color="light red lighten-2" @click="$emit('close-modal')">
                Exit
            </v-btn>
            <v-btn color="primary" @click="addPlan()">Add</v-btn>
        </div>
    </div>
</template>

<script>
  export default {
      name: "StudyPlanComponent",

      mounted () {
        this.$store.commit('users/currentNote', JSON.parse(localStorage.getItem('note')))
      },

      data () {
        return {
            date: "",
            time: "",
            timeAmount: 5,
            priority: 1,
            completed: false,
            showDate: false,
            showTime: false
        }
      },

      methods: {
            addPlan () {
                this.$store.dispatch('users/addPlan', {
                    date: this.date,
                    time: this.time,
                    amount: this.timeAmount,
                    priority: this.priority,
                    completed: this.completed,
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
                if (parseInt(hour) > 12) {
                    hour -= 12
                    hour.toString()
                    this.time = hour + this.time[2] + this.time[3] + this.time[4]
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
      }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 425px;
  width: 500px;
  margin-top: 10%;
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
    margin-top: 10px;
}

.when {
    border: solid 1.5px;
    border-radius: 8px;
    margin-left: 15px;
    width: 125px;
    height: 30px;
    font-weight: bold;
    background-color: rgba(215, 236, 243, 0.781);
}


</style>