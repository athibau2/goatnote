<template>
    <v-dialog class="dialog" v-model="showQuickWord"
        :width="windowWidth < 800 ? '90%' : '40%'"
    >
        <div class="dialog-card" elevation="5" @keydown.esc="close" @keydown.enter="saveWord">
            <v-text-field
                autofocus
                v-model="word"
                label="Press Enter when finished or Esc key to exit"
            ></v-text-field>
        </div>
    </v-dialog>
</template>

<script>
export default {
    name: 'QuickWordComponent',

    created () {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    },

    data () {
        return {
            windowWidth: window.innerWidth,
            word: ''
        }
    },

    methods: {
        async saveWord(event) {
            if (this.word != '') {
                await this.$store.dispatch('users/addPreparedWord', {
                    word: this.word,
                    noteid: this.currentNote.noteid
                })
            }
            await this.$store.commit('users/setShowQuickWord', false)
            event.preventDefault();
            this.word = ''
        },

        async close() {
            this.word = ''
            await this.$store.commit('users/setShowQuickWord', false)
        }
    },

    computed: {
        showQuickWord: {
            get () {
                return this.$store.state.users.showQuickWord
            },

            async set () {
                await this.$store.commit('users/setShowQuickWord', false)
            }
        },

        preparedWords () {
            return this.$store.state.users.preparedWords
        },

        currentNote () {
            return this.$store.state.users.currentNote
        }
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.dialog-card {
    background-color: #f9f9f9;
    padding: 5px 10px;
}

</style>