<template>
    <v-dialog
        v-model="showMyWhiteboards"
        :width="windowWidth < 800 ? '90%' : '50%'"
    >
        <v-card class="dialog-card" elevation="5">
            <v-card-title class="basic-header justify-center">My Whiteboards</v-card-title>
            <v-card-subtitle class="text-center">
              Click the whiteboard you want to switch to, then click 'Replace All'.
              Or, to combine whiteboards, select one of the other options.
            </v-card-subtitle>
            <v-divider style="margin-bottom: 10px;" />
            <v-card-text>
                <div class="whiteboard-grid">
                    <div class="whiteboard-wrapper" v-for="(board, i) in whiteboards" :key="i">
                        <button class="whiteboard-btn" @click="openWhiteboard(board)">
                            <img class="whiteboard" :src="board.data" />
                        </button>
                        <v-btn class="overlay-btn" @click="deleteWhiteboard(board)" small icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text class="flat-btn" @click="close()">Close</v-btn>
              <v-spacer />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'WhiteboardsComponent',

  created () {
    window.addEventListener('resize', this.resizeHandler)
  },

  data () {
    return {
        windowWidth: window.innerWidth,
    }
  },

  methods: {
    resizeHandler() {
      this.windowWidth = window.innerWidth
    },

    async openWhiteboard(board) {
        localStorage.setItem('current_whiteboard', JSON.stringify(board))
        this.$emit('opened-board')
        this.close()
    },

    async deleteWhiteboard(board) {
        await this.$store.dispatch('users/deleteWhiteboard', {
            boardid: board.boardid,
            noteid: board.noteid
        })
    },

    async close () {
      await this.$store.commit('users/setShowMyWhiteboards', false)
    }
  },

  computed: {
    user () {
      return this.$store.state.users.user
    },

    userData () {
      return this.$store.state.users.userData
    },

    showMyWhiteboards: {
      get () {
        return this.$store.state.users.showMyWhiteboards
      },

      async set () {
        await this.$store.commit('users/setShowMyWhiteboards', false)
      }
    },

    whiteboards () {
        return this.$store.state.users.whiteboards
    }
  },
}
</script>

<style scoped>
@import '~/assets/styles.css';

.whiteboard-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.whiteboard-wrapper {
    position: relative;
}

.overlay-btn {
    position: absolute;
    top: 0;
    right: 0;
}

.whiteboard {
    border: solid 1px;
    max-height: 100px;
    margin: 3px;
}

.whiteboard:hover {
    opacity: 0.6;
}

</style>
