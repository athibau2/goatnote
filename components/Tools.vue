<template>
    <v-dialog
        v-model="showStudyTools"
        :width="windowWidth < 800 ? '90%' : '50%'"
    >
        <v-card class="dialog-card" elevation="5">
            <v-tabs
                background-color="transparent"
                style="padding: 5px 0;"
                v-model="tab"
                show-arrows
                centered
            >
            <v-tabs-slider></v-tabs-slider>
                <v-tab v-for="item in items" :key="item.tab">
                    {{item.tab}}
                </v-tab>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        style="float: right; margin-top: 5px;"
                        v-bind="attrs"
                        v-on="on"
                        @click="toggleStudy()"
                        icon
                    >
                        <v-icon size="35">mdi-head-question</v-icon>
                    </v-btn>
                    </template>
                    <span>{{studyMode ? 'Turn off study mode' : 'Begin Study'}}</span>
                </v-tooltip>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item class="shared-list" v-for="item in items" :key="item.tab">
                    <Flashcards v-if="tab === 0" />
                    <Files v-if="tab === 1" />
                    <Links v-if="tab === 2" />
                    <StudyPlans v-if="tab === 3" />
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-dialog>
</template>

<script>
import Flashcards from '~/components/Flashcards.vue'
import Links from '~/components/Links.vue'
import Files from '~/components/Files.vue'
import StudyPlans from '~/components/StudyPlans.vue'

export default {
    name: 'ToolsComponent',

    created () {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    },

    components: {
        Flashcards,
        Links,
        Files,
        StudyPlans
    },

    data () {
        return {
            windowWidth: window.innerWidth,
            tab: null,
            items: [
                { tab: 'flashcards' },
                { tab: 'files' },
                { tab: 'links' },
                { tab: 'study plans' },
                // :disabled="user.user_id == currentNote.userid ? false : true"
            ],
        }
    },

    methods: {
        async toggleStudy () {
            await this.$store.commit('users/study', !this.studyMode)
                if (!this.studyMode) {
                alert('Study mode has been turned off.')
            }
            else {
                alert('Study mode has been turned on.')
            }
        },
    },

    computed: {
        showStudyTools: {
            get () {
                return this.$store.state.users.showStudyTools
            },

            async set () {
                await this.$store.commit('users/setShowStudyTools', false)
            }
        },

        studyMode () {
            return this.$store.state.users.studyMode
        },
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';


</style>