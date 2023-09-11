<template>
  <v-app dark style="position: relative;">
    <script src="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/js/shepherd.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shepherd.js@8.3.1/dist/css/shepherd.css"/>

    <v-navigation-drawer
      class="main"
      id="menu-step-6"
      v-if="windowWidth >= 800"
      :mini-variant="windowWidth < 1000 ? true : miniVariant"
      :clipped="true"
      fixed
      app
      :permanent="windowWidth < 1000 ? !miniVariant : true"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          style="text-decoration: none;"
          :key="i"
          :id="'menu-step-'+i"
          :to="item.to"
          @click="item.click"
          router
          exact
          :disabled="item.title !== 'Admin' ? false : userData?.isadmin ? false : true"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      class="app-bar"
      :clipped-left="true"
      :clipped-right="true"
      fixed
      app
      color="light grey lighten-2"
    >
      <v-menu bottom
        offset-y
        transition="slide-y-transition"
        v-if="showSmallMenu"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon
            v-on="on"
            v-bind="attrs"
          />
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            style="text-decoration: none;"
            :key="i"
            :id="'menu-step-'+i"
            :to="item.to"
            @click="item.click"
            router
            exact
            :disabled="item.title !== 'Admin' ? false : userData?.isadmin ? false : true"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-tooltip bottom v-if="!showSmallMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon
            @click.stop="miniVariant = !miniVariant"
            v-on="on"
            v-bind="attrs"
          />
        </template>
        <span>{{miniVariant ? 'Expand' : 'Collapse'}}</span>
      </v-tooltip>
      <button class="logo-btn" @click="toHome()">
        <img class="logo" src="~/assets/logos/GN.png" height="45px">
      </button>
      <v-spacer/>

      <v-toolbar-title class="name-display" v-if="userData !== null && userData !== undefined">
        {{userData.firstname}}
      </v-toolbar-title>
      <v-btn to="/account" icon><v-icon size="30">mdi-account</v-icon></v-btn>

      <v-menu bottom
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn id="step-2" icon v-on="on" v-bind="attrs">
            <v-icon size="30">mdi-checkbox-outline</v-icon>
          </v-btn>
        </template>
        <div
          :style="{'width': windowWidth < 800 ? '85vw' : '40vw', 'background-color': '#f9f9f9', 'padding': '15px', 'z-index': '0 !important'}"
        >
          <div v-if="!seeTasksDueToday" style="white-space: nowrap;">
            <!-- Level 0 -->
            <v-menu
              bottom
              offset-y
              transition="slide-y-transition"
              close-on-content-click
              ref="todoMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <span
                  class="basic-header"
                  style="font-size: 18px; margin-right: 10px;"
                  v-on="on"
                  v-bind="attrs"
                >
                  {{todoColl ? parseMenuName(todoColl.collectionname) : 'Select'}}
                  <v-icon>mdi-chevron-down</v-icon>
                </span>
              </template>
              <v-list style="max-height: 250px;">
                <v-list-item v-for="(org, i) in orgs"
                  :key="i"
                  link
                  style="background-color: #f9f9f9;"
                >
                  <!-- Level 1 -->
                  <v-menu right
                    offset-x
                    close-on-content-click
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        class="basic-header"
                        style="font-size: 18px; margin-right: 10px;"
                        v-on="on"
                        v-bind="attrs"
                        @click.stop="loadFoldersAndColls(org)"
                      >
                        {{parseMenuName(org.orgname)}}
                        <v-icon>mdi-chevron-down</v-icon>
                      </span>
                    </template>
                    <v-list style="max-height: 250px;">
                      <v-list-item v-for="(folder, i) in taskFolders"
                        :key="i"
                        link
                        style="background-color: #f9f9f9;"
                      >
                        <!-- Level 3 -->
                        <v-menu right
                          offset-x
                          close-on-content-click
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <span
                              class="basic-header"
                              style="font-size: 18px; margin-right: 10px;"
                              v-on="on"
                              v-bind="attrs"
                              @click.stop="loadFolderColls(folder)"
                            >
                              {{parseMenuName(folder.foldername)}}
                              <v-icon>mdi-chevron-down</v-icon>
                            </span>
                          </template>
                          <v-list style="max-height: 250px;">
                            <v-list-item v-for="(coll, i) in taskFolderColls"
                              :key="i"
                              @click.stop="loadCollToDo(coll)"
                              link
                              style="background-color: #f9f9f9;"
                            >
                              <span>{{coll.collectionname}}</span>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-list-item>
                      <v-divider />
                      <v-list-item v-for="(coll, i) in taskColls"
                        :key="i"
                        @click.stop="loadCollToDo(coll)"
                        link
                        style="background-color: #f9f9f9;"
                      >
                        <span>{{coll.collectionname}}</span>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-row v-if="windowWidth >= 800" style="margin: 0 0 5px 0;">
            <v-switch hide-details
              color="#85c59d"
              v-model="seeTasksDueToday"
              label="See All Due Today"
              style="max-height: 12px; max-width: 45%; margin-right: 30px;"
            ></v-switch>
            <v-switch hide-details
              v-if="!seeTasksDueToday"
              color="#85c59d"
              v-model="hideCompleted"
              label="Hide Completed"
              style="max-height: 12px; max-width: 45%;"
            ></v-switch>
          </v-row>
          <div v-else-if="windowWidth < 800">
            <v-switch hide-details
              color="#85c59d"
              v-model="seeTasksDueToday"
              label="See All Due Today"
              style="max-height: 12px; margin-right: 30px;"
            ></v-switch>
            <v-switch hide-details
              v-if="!seeTasksDueToday"
              color="#85c59d"
              v-model="hideCompleted"
              label="Hide Completed"
              style="max-height: 12px;"
            ></v-switch>
          </div>
          <v-divider style="background-color: #f9f9f9;" />
          <Loading v-if="loadingTodo" />
          <v-list class="task-list">
            <div class="task-item"
              v-for="(task, i) in seeTasksDueToday ? tasksDueToday : hideCompleted ? filteredTodoList(todoList) : todoList"
              :key="i"
            >
              <v-list-item dense style="height: 20px">
                <v-col cols="7">
                  <v-text-field v-if="editText && task.todoid == taskBeingEdited.todoid"
                    :value="task.todotext"
                    @input="textChanged($event)"
                    @keydown.enter="updateTaskText()"
                  ></v-text-field>
                  <v-tooltip v-if="!editText || task.todoid != taskBeingEdited?.todoid" top>
                    <template v-slot:activator="{ on, attrs }">
                      <button @click="setEditText(task)"
                        :disabled="editDeadline || (editText && task.todoid != taskBeingEdited.todoid)"
                        v-on="on"
                        v-bind="attrs"
                      >
                        <span :style="task.completed ? {'text-decoration': 'line-through'} : null">{{task.todotext}}</span><br>
                        <span v-if="seeTasksDueToday"><em>{{task.collectionname}}</em></span>
                      </button>
                    </template>
                    <span>Edit Task</span>
                  </v-tooltip>
                </v-col>
                <v-spacer />
                <v-col cols="5" style="text-align: right;">
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
                </v-col>
              </v-list-item>
              
            </div>
          </v-list>
          <div v-if="todoColl && !seeTasksDueToday">
            <v-alert v-if="alert"
              class="alert"
              :color="alert.color"
              :icon="alert.icon"
            >{{alert.text}}</v-alert>
            <v-text-field
              v-model="taskText"
              dense
              placeholder="Enter Task Details"
            ></v-text-field>
            <center style="margin-bottom: 10px;">
              <label for="deadline">Deadline</label>
              <input type="date" name="deadline" v-model="deadline" style="margin-right: 10px;" required />
              <v-btn class="good-btn" @click="createTodo()">
                <Loading v-if="creatingTodo" /> {{creatingTodo ? null : 'Add'}}
              </v-btn>
            </center>
          </div>
        </div>
      </v-menu>
    </v-app-bar>

    <v-main class="main">
      <v-container class="main" id="step-5">
        <Nuxt class="main" />
        <v-alert v-if="alert"
          class="alert"
          :color="alert.color"
          :icon="alert.icon"
        >{{alert.text}}</v-alert>
      </v-container>
    </v-main>

    <Footer />

  </v-app>
</template>

<script>
import Shepherd from 'shepherd.js'
import Footer from '~/components/Footer.vue'
import Loading from '~/components/Loading.vue'

export default {
  name: 'DefaultLayout',
  middleware: 'auth',

  async created () {
    await this.$store.dispatch('users/getSupabaseUser')
    window.addEventListener('resize', this.resizeHandler)
    await this.$store.dispatch('users/orgs')
  },

  async mounted () {
    let link = JSON.parse(localStorage.getItem('purchase_link'))
    if (this.googleSuccess && link != null) {
      window.location.href = `${link}?prefilled_email=${this.encodedEmail}`
      await this.$store.commit('users/googleSuccess', false)
      localStorage.removeItem('purchase_link')
    }
    if (!this.userData?.onboarded) {
      this.addSteps()
      this.tour.start()
      this.tour.on('complete', this.onboardingComplete)
    }
  },

  components: {
    Footer,
    Loading
  },

  data () {
    return {
      fixed: false,
      showToDo: false,
      loadingTodo: false,
      creatingTodo: false,
      taskText: '',
      level: 0,
      deadline: null,
      showSmallMenu: window.innerWidth < 800,
      seeTasksDueToday: false,
      hideCompleted: false,
      newDeadline: null,
      newTaskText: '',
      editDeadline: false,
      editText: false,
      taskBeingEdited: null,
      isadmin: this.userData?.isadmin,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
          click: this.loadOrgs
        },
        {
          icon: 'mdi-domain',
          title: 'Join Organization',
          to: '/join'
        },
        {
          icon: 'mdi-calendar-alert',
          title: 'My Study Plans',
          to: '/plans'
        },
        {
          icon: 'mdi-share-variant',
          title: 'Shared With Me',
          to: '/shared'
        },
        {
          icon: 'mdi-account-cog',
          title: 'My Account',
          to: '/account',
        },
        {
          icon: 'mdi-account-key',
          title: 'Admin',
          to: '/admin',
        },
        {
          icon: 'mdi-help',
          title: 'Tutorial',
          click: this.runTutorial,
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          click: this.logout
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'GOAT Notes',
      windowWidth: window.innerWidth,
      tour: new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark',
        }
      }),
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

    windowWidth(newValue, oldValue) {
      if (newValue < 800 && oldValue >= 800) {
        this.showSmallMenu = true
      } else if (newValue >= 800 && oldValue <= 799) {
        this.showSmallMenu = false
      }
    },

    newDeadline(newValue, oldValue) {
      if (newValue != null && oldValue == null) {
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
    }
  },

  methods: {
    addSteps() {
      this.tour.addSteps([
        {
          id: 'step-1',
          text: 'Welcome to GOAT Notes. Let\'s get you started on your tour!',
          buttons: [
            {
              text: 'Okay!',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'step-5',
          text: 'The organizations you are a part of will show up here. Click \'Open\' to expand and see your collections, and then again to see your notes.',
          attachTo: {
            element: '#step-5',
            on: 'top'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'step-6',
          text: 'The \'+\' button next to \'Your Organizations\' is where you can create new objects. Create an Organization (e.g. University name), a Collection (e.g. Class name), or a Note (e.g. Lecture title).',
          attachTo: {
            element: '#step-5',
            on: 'top'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'step-2',
          text: 'Here you can keep track of all your tasks, including homework assignments, projects, exams, etc.',
          attachTo: {
            element: '#step-2',
            on: 'bottom'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-1',
          text: 'This page lets you search for existing organizations to join. If they are a private organization, you\'ll need to get the join code from someone in the organization.',
          attachTo: {
            element: '#menu-step-1',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-2',
          text: 'This page helps you keep track of all the study plans you haven\'t completed for all of your notes.',
          attachTo: {
            element: '#menu-step-2',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'menu-step-3',
          text: 'You have the ability to share entire collections or just individual notes with people as long as they are also in the same organization. On this page, you can see all the collections and notes that have been shared with you. You can\'t edit the notes they have written, but you can add flashcards, files, and links to their notes.',
          attachTo: {
            element: '#menu-step-3',
            on: 'right'
          },
          buttons: [
            {
              text: 'Next',
              action: this.tour.next
            }
          ]
        },
        {
          id: 'final-step',
          text: 'That concludes our tour! Now, get to it!',
          buttons: [
            {
              text: 'Finish',
              action: this.tour.complete
            }
          ]
        },
      ]);
    },

    parseMenuName(name) {
      if (name.length >= 14) {
        let short = name.substring(0, 14) + '...'
        return short
      } else return name
    },

    filteredTodoList(list) {
      return list.filter(task => task.completed == false)
    },

    runTutorial() {
      this.toHome()
      this.addSteps()
      this.tour.start()
    },

    async onboardingComplete () {
      await this.$store.dispatch('users/basicOnboardingComplete')
    },

    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    toHome() {
      this.$router.push('/')
    },

    logout() {
      this.$store.dispatch('users/logout')
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
          text: 'No field may be left empty'
        })
      } else {
        this.creatingTodo = true
        await this.$store.dispatch('users/createTodo', {
          text: this.taskText,
          deadline: this.deadline,
          collectionid: this.todoColl.collectionid
        })
        this.creatingTodo = false
        this.taskText = '',
        this.deadline = null
      }
    },

    async toggleComplete(task) {
      await this.$store.dispatch('users/updateTodo', {
        text: null,
        completed: !task.completed,
        todoid: task.todoid,
        deadline: null,
        collectionid: task.collectionid ?? this.todoColl.collectionid,
        seeTasksDueToday: this.seeTasksDueToday
      })
    },

    async updateDeadline() {
      await this.$store.dispatch('users/updateTodo', {
        text: null,
        completed: null,
        todoid: this.taskBeingEdited.todoid,
        deadline: this.newDeadline,
        collectionid: this.todoColl.collectionid,
        seeTasksDueToday: this.seeTasksDueToday
      })
      this.taskBeingEdited = null
      this.editDeadline = false
    },

    async updateTaskText() {
      await this.$store.dispatch('users/updateTodo', {
        text: this.newTaskText,
        completed: null,
        todoid: this.taskBeingEdited.todoid,
        deadline: null,
        collectionid: this.todoColl.collectionid,
        seeTasksDueToday: this.seeTasksDueToday
      })
      this.taskBeingEdited = null
      this.editText = false
    },

    async deleteTodo(task) {
      await this.$store.dispatch('users/deleteTodo', {
        todoid: task.todoid,
        collectionid: this.todoColl.collectionid,
        seeTasksDueToday: this.seeTasksDueToday
      })
    },

    prettyDate(deadline) {
      let date = deadline.toString().split('-')
      return `${date[1]} / ${date[2]} / ${date[0]}`
    },

    loadOrgs () {
      this.$store.dispatch('users/orgs')
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

<style scoped>
@import '~/assets/styles.css';

.topButton {
  margin-right : 3px;
}

.name-display {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 22px;
  letter-spacing: 1px;
}

.logo-btn {
  transition: transform 0.5s;
}

.logo-btn:hover {
    transform: scale(1.05);
}

.logo {
  margin: 2px 6px 2px 6px;
  vertical-align: middle;
}

.task-list {
  height: 50vh;
  overflow-y: scroll;
  background-color: #f9f9f9;
}

.task-item {
  padding: 10px 0;
}

.task-item:nth-child(odd) {
  background-color: #eeeeee;
  border-radius: 10px;
}

</style>