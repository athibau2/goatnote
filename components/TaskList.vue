<template>
    <div>
        <v-row style="margin: 0 0 5px 0;">
            <div>
                <div>
                    <sl-switch id="due-today-switch"
                        :checked="seeTasksDueToday"
                        :disabled="viewSelection == 1"
                    >
                        See All Due Today
                    </sl-switch>
                </div>
                <div>
                    <sl-switch id="hide-complete-switch"
                        :disabled="seeTasksDueToday"
                        :checked="hideCompleted"
                    >
                        Hide Completed
                    </sl-switch>
                </div>
            </div>
            <v-spacer />
            <sl-button-group label="View Type">
                <sl-tooltip content="List View" placement="bottom">
                    <sl-icon-button name="list-check"
                        label="List"
                        @click="viewSelection = 0"
                        :style="{'font-size': '28px', 'border': `solid ${viewSelection == 0 ? '#85c59d' : 'grey'} 1px`, 'border-top-left-radius': '6px', 'border-bottom-left-radius': '6px', 'color': viewSelection == 0 ? '#85c59d' : null}"
                    ></sl-icon-button>
                </sl-tooltip>
                <sl-tooltip content="Calendar View" placement="bottom">
                    <sl-icon-button name="calendar-check"
                        label="Calendar"
                        @click="viewSelection = 1"
                        :style="{'font-size': '28px', 'border': `solid ${viewSelection == 1 ? '#85c59d' : 'grey'} 1px`, 'border-top-right-radius': '6px', 'border-bottom-right-radius': '6px', 'color': viewSelection == 1 ? '#85c59d' : null}"
                    ></sl-icon-button>
                </sl-tooltip>
            </sl-button-group>
        </v-row>
        <Loading v-if="loadingTodo" />
        <v-list class="task-list" id="list-view" v-if="viewSelection == 0" style="position: relative;">
          <v-row class="task-item"
            v-for="(task, i) in seeTasksDueToday ? tasksDueToday : hideCompleted ? filteredTodoList(todoList) : todoList"
            :key="i"
          >
            <div style="width: 100%; display: flex;">
              <div style="width: 70%; display: flex; align-items: center;">
                <v-text-field v-if="editText && task.todoid == taskBeingEdited.todoid"
                  :value="task.todotext"
                  @input="textChanged($event)"
                  @keydown.enter="updateTaskText(task)"
                ></v-text-field>
                <v-tooltip v-if="!editText || task.todoid != taskBeingEdited?.todoid" top>
                  <template v-slot:activator="{ on, attrs }">
                    <button @click="setEditText(task)"
                      :disabled="editDeadline || (editText && task.todoid != taskBeingEdited.todoid)"
                      v-on="on"
                      v-bind="attrs"
                      style="text-align: left;"
                    >
                      <span :style="task.completed ? {'text-decoration': 'line-through'} : null">{{task.todotext}}</span><br>
                      <span><em>{{task.topic}}</em></span>
                    </button>
                  </template>
                  <span>Edit Task</span>
                </v-tooltip>
              </div>
              <v-spacer />
              <div style="width: 30%;">
                <div style="text-align: right;">
                  <input v-if="editDeadline && task.todoid == taskBeingEdited.todoid"
                    type="date"
                    name="deadline"
                    v-model="newDeadline"
                    style="margin-right: 10px;"
                    required
                  />
                  <v-tooltip v-if="!editDeadline || task.todoid != taskBeingEdited?.todoid" top>
                    <template v-slot:activator="{ on, attrs }">
                      <button @click="setEditDeadline(task)"
                        :disabled="editText || (editDeadline && task.todoid != taskBeingEdited.todoid)"
                        v-on="on"
                        v-bind="attrs"
                      >
                        {{prettyDate(task.deadline)}}
                      </button>
                    </template>
                    <span>Edit Deadline</span>
                  </v-tooltip>
                  <br>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="toggleComplete(task)" v-on="on" v-bind="attrs" small icon>
                        <v-icon size="25">
                          {{task.completed ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'}}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Completed</span>
                  </v-tooltip>
                  <v-btn @click="deleteTodo(task)" small icon>
                    <v-icon size="25">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-row>
        </v-list>

        <FullCalendar v-if="viewSelection == 1" :options="calendarOptions" />

        <sl-dialog id="task-dialog" v-if="showEventPopup" :label="popupEvent.todotext">
            <div>
                <div style="text-align: center;">
                  <label for="deadline">Deadline</label>
                  <input v-if="editDeadline && popupEvent.todoid == taskBeingEdited.todoid"
                    type="date"
                    name="deadline"
                    v-model="newDeadline"
                    style="margin-right: 10px;"
                    required
                  />
                  <v-tooltip v-if="!editDeadline || popupEvent.todoid != taskBeingEdited?.todoid" top>
                    <template v-slot:activator="{ on, attrs }">
                      <button @click="setEditDeadline(popupEvent)"
                        :disabled="editText || (editDeadline && popupEvent.todoid != taskBeingEdited.todoid)"
                        v-on="on"
                        v-bind="attrs"
                      >
                        {{prettyDate(popupEvent.deadline)}}
                      </button>
                    </template>
                    <span>Edit Deadline</span>
                  </v-tooltip>
                  <br>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="toggleComplete(popupEvent)" v-on="on" v-bind="attrs" small icon>
                        <v-icon size="25">
                          {{popupEvent.completed ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'}}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Completed</span>
                  </v-tooltip>
                  <v-btn @click="deleteTodo(popupEvent)" small icon>
                    <v-icon size="25">mdi-delete</v-icon>
                  </v-btn>
                </div>
            </div>
        </sl-dialog>

        <div v-if="viewSelection == 0" slot="footer" style="position: absolute; bottom: 20px; width: 91%; backdrop-filter: blur(8px);">
          <v-row style="margin: 4px 0;">
                <sl-input id="task-input"
                   type="text"
                   :value="taskText"
                   @input="taskText = $event.target.value"
                   placeholder="Details (i.e., HW 3)"
                   :style="{'margin-right': windowWidth < 700 ? '0' : '2px', 'margin-bottom': windowWidth < 700 ? '4px' : null, 'width': windowWidth < 700 ? '98%' : '49.75%'}"
                   required
                 >
                 </sl-input>
                 <sl-input id="topic-input"
                   type="text"
                   :value="topic"
                   @input="topic = $event.target.value"
                   placeholder="Topic (i.e., BIO 100)"
                   :style="{'margin-left': windowWidth < 700 ? '0' : '2px', 'width': windowWidth < 700 ? '98%' : '49.5%'}"
                   required
                 >
                 </sl-input>
          </v-row>
          <v-row style="margin: 4px 0;">
            <sl-input id="task-deadline"
                type="date"
                :value="deadline"
                @input="deadline = $event.target.value"
                :style="{'width': windowWidth < 800 ? null : '50%', 'margin-right': '5px'}"
                required
            ></sl-input>
            <v-btn class="good-btn" @click="createTodo()">
              <Loading v-if="creatingTodo" /> {{creatingTodo ? null : 'Add'}}
            </v-btn>
          </v-row>
        </div>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'

export default {
    name: "TaskListComponent",

    created () {
        window.addEventListener('resize', () => this.windowWidth = window.innerWidth)
    },

    mounted () {
        let todaySwitch = document.getElementById('due-today-switch')
        todaySwitch.addEventListener('sl-change', () => this.seeTasksDueToday = !this.seeTasksDueToday)
        let hideCompleteSwitch = document.getElementById('hide-complete-switch')
        hideCompleteSwitch.addEventListener('sl-change', () => this.hideCompleted = !this.hideCompleted)
    },

    components: {
        FullCalendar
    },

    data () {
        return {
            windowWidth: window.innerWidth,
            showToDo: false,
            loadingTodo: false,
            creatingTodo: false,
            taskText: '',
            topic: '',
            level: 0,
            deadline: null,
            seeTasksDueToday: false,
            hideCompleted: true,
            newDeadline: null,
            newTaskText: '',
            editDeadline: false,
            editText: false,
            taskBeingEdited: null,
            viewSelection: 0,
            showEventPopup: false,
            popupEvent: null,
            eventDialog: null,
            calendarOptions: {
                plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
                initialView: 'dayGridMonth',
                dateClick: this.handleDateClick,
                editable: true,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek'
                },
                eventClick: this.eventPopup,
                events: []
            }
        }
    },

    watch: {
        async alert(newValue, oldValue) {
            if (newValue != null && oldValue == null) {
                setTimeout(async () => {
                await this.$store.commit('users/setAlert', null)
                }, 5000);
            }
        },

        viewSelection(newValue) {
            let todaySwitch = document.getElementById('due-today-switch')
            todaySwitch.addEventListener('sl-change', () => this.seeTasksDueToday = !this.seeTasksDueToday)
            let hideCompleteSwitch = document.getElementById('hide-complete-switch')
            hideCompleteSwitch.addEventListener('sl-change', () => this.hideCompleted = !this.hideCompleted)
            if (newValue == 1) {
                this.seeTasksDueToday = false
                this.calendarOptions.events = this.hideCompleted ? this.filteredTodoList(this.todoList) : this.todoList
            }
        },

        hideCompleted(newValue) {
            if (this.viewSelection == 1) {
                this.calendarOptions.events = newValue ? this.filteredTodoList(this.todoList) : this.todoList
            }
        },

        windowWidth(newValue, oldValue) {
            if (newValue < 800 && oldValue >= 800) {
                this.showSmallMenu = true
            } else if (newValue >= 800 && oldValue <= 799) {
                this.showSmallMenu = false
            }
        },

        newDeadline(newValue, oldValue) {
            if (newValue) {
                this.updateDeadline()
            }
        },

        async level(newValue) {
            if (newValue == 1 || newValue == 3) {
                await this.$store.commit('users/setTodoList', [])
            }
        },

        async seeTasksDueToday(newValue, oldValue) {
            if (newValue == true) {
                this.loadingTodo = true
                await this.$store.dispatch('users/getTasksDueToday')
                this.loadingTodo = false
            }
        },
    },

    methods: {
        parseMenuName(name) {
            if (name.length >= 14) {
                let short = name.substring(0, 14) + '...'
                return short
            } else return name
        },

        filteredTodoList(list) {
            return list.filter(task => task.completed == false)
        },

        async handleDateClick(arg) {
            // console.log(arg)
        },

        async eventPopup(arg) {
            this.eventDialog = document.getElementById('task-dialog');
            this.popupEvent = arg.event._def.extendedProps
            this.showEventPopup = true
            this.eventDialog?.show();
        },

        async eventPopupClose() {
            this.showEventPopup = false
            this.eventDialog.hide()
        },

        async setShowTaskList() {
            const drawer = document.querySelector('.drawer-overview');
            const openButton = document.getElementById('task-list-btn')
            const closeButton = drawer.querySelector('sl-button[variant="primary"]');

            openButton.addEventListener('click', () => drawer.show());
            closeButton.addEventListener('click', () => drawer.hide());
            // await this.$store.commit('setShowTaskList', true)
        },

        async loadFoldersAndColls(org) {
            this.level = 1
            await this.$store.commit('users/setTodoFolder', null)
            await this.$store.commit('users/setTodoColl', null)
            await this.$store.commit('users/setTodoOrg', org)
            await this.$store.dispatch('users/getTaskFolders', {
                orgid: org.orgid
            })
        },

        async loadFolderColls(folder) {
            this.level = 3
            await this.$store.commit('users/setTodoColl', null)
            await this.$store.commit('users/setTodoFolder', folder)
            await this.$store.dispatch('users/getTaskFolderColls', {
                folderid: folder.folderid
            })
        },

        async loadCollToDo(coll) {
            this.level == 1 ? this.level = 2 : this.level = 4
            this.$refs.todoMenu.isActive = false
            if (this.level == 2) await this.$store.commit('users/setTodoFolder', null)
            await this.$store.commit('users/setTodoColl', coll)
            this.loadingTodo = true
            await this.$store.dispatch('users/loadTodoList', {
                collectionid: coll.collectionid
            })
            this.loadingTodo = false
        },

        textChanged(event) {
            this.newTaskText = event
        },

        setEditDeadline(task) {
            this.taskBeingEdited = task
            this.editDeadline = true
        },

        setEditText(task) {
            this.taskBeingEdited = task
            this.editText = true
        },

        async createTodo() {
            if (this.taskText == '' || this.deadline == null) {
                await this.$store.commit('users/setAlert', {
                    color: 'error',
                    icon: '$error',
                    text: 'Task details and Deadline must both be entered'
                })
            } else {
                this.creatingTodo = true
                await this.$store.dispatch('users/createTodo', {
                    text: this.taskText,
                    topic: this.topic,
                    deadline: this.deadline,
                })
                this.creatingTodo = false
                this.taskText = ''
                this.topic = ''
                this.deadline = null
            }
        },

        async toggleComplete(task) {
            await this.$store.dispatch('users/updateTodo', {
                text: null,
                topic: task.topic,
                completed: !task.completed,
                todoid: task.todoid,
                deadline: null,
                seeTasksDueToday: this.seeTasksDueToday
            })
            if (this.showEventPopup) {
                this.todoList.forEach(element => {
                    if (element.todoid == task.todoid) {
                        this.popupEvent = element
                    }
                });
                this.calendarOptions.events = this.hideCompleted ? this.filteredTodoList(this.todoList) : this.todoList
            }
        },

        async updateDeadline() {
            await this.$store.dispatch('users/updateTodo', {
                text: null,
                topic: this.taskBeingEdited.topic,
                completed: null,
                todoid: this.taskBeingEdited.todoid,
                deadline: this.newDeadline,
                seeTasksDueToday: this.seeTasksDueToday
            })
            if (this.showEventPopup) {
                this.todoList.forEach(element => {
                    if (element.todoid == this.taskBeingEdited.todoid) {
                        this.popupEvent = element
                    }
                });
                this.calendarOptions.events = this.hideCompleted ? this.filteredTodoList(this.todoList) : this.todoList
            }
            this.taskBeingEdited = null
            this.editDeadline = false
        },

        async updateTaskText(task) {
            await this.$store.dispatch('users/updateTodo', {
                text: this.newTaskText,
                topic: task.topic,
                completed: null,
                todoid: this.taskBeingEdited.todoid,
                deadline: null,
                seeTasksDueToday: this.seeTasksDueToday
            })
            this.taskBeingEdited = null
            this.editText = false
        },

        async deleteTodo(task) {
            await this.$store.dispatch('users/deleteTodo', {
                todoid: task.todoid,
                seeTasksDueToday: this.seeTasksDueToday
            })
            if (this.showEventPopup) {
                this.eventPopupClose()
                this.calendarOptions.events = this.hideCompleted ? this.filteredTodoList(this.todoList) : this.todoList
            }
        },

        prettyDate(deadline) {
            let date = deadline.toString().split('-')
            return `${date[1]} / ${date[2]} / ${date[0]}`
        },
    },

    computed: {
        userData() {
            return this.$store.state.users.userData
        },

        orgs () {
            return this.$store.state.users.orgs
        },

        collections () {
            return this.$store.state.users.collections
        },

        todoOrg () {
            return this.$store.state.users.todoOrg
        },

        todoFolder () {
            return this.$store.state.users.todoFolder
        },
        
        todoColl () {
            return this.$store.state.users.todoColl
        },

        todoList () {
            return this.$store.state.users.todoList
        },

        tasksDueToday () {
            return this.$store.state.users.tasksDueToday
        },

        taskFolders () {
            return this.$store.state.users.taskFolders
        },

        taskColls () {
            return this.$store.state.users.taskColls
        },

        taskFolderColls () {
            return this.$store.state.users.taskFolderColls
        },

        showTaskList() {
            return this.$store.state.users.showTaskList
        },

        googleSuccess () {
            return this.$store.state.users.googleSuccess
        },

        encodedEmail () {
            if (this.userData?.email) {
                return encodeURIComponent(this.userData?.email)
            }
        },

        alert () {
            return this.$store.state.users.alert
        }
    }
}
</script>

<style>
@import '~/assets/styles.css';

.task-list {
  /* height: 50vh; */
  /* overflow-y: scroll; */
  background-color: #f9f9f9;
}

.task-item {
  margin: 10px 0;
  padding: 10px 8px;
  height: auto;
}

.task-item:nth-child(odd) {
  background-color: #eeeeee;
  border-radius: 10px;
}

</style>