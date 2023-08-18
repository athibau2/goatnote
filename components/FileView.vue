<template>
    <v-dialog
        v-model="showFileView"
        fullscreen
    >
        <v-card class="dialog-card" elevation="5">
            <v-toolbar class="toolbar">
                <v-btn icon @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    File Viewer
                </v-toolbar-title>
            </v-toolbar>
            <iframe class="file-frame" v-if="openedFile && isDoc" :src="`https://docs.google.com/gview?url=${openedFile.url}&embedded=true`"></iframe>
            <iframe class="file-frame" v-if="openedFile && !isDoc" :src="openedFile?.url"></iframe>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'FileViewComponent',

    created () {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth
        })
    },

    data () {
        return {
            windowWidth: window.innerWidth
        }
    },

    methods: {
        async close() {
            await this.$store.commit('users/setOpenedFile', null)
            await this.$store.commit('users/setShowFileView', false)
        }
    },

    computed: {
        showFileView: {
            get () {
                return this.$store.state.users.showFileView
            },

            async set () {
                await this.$store.commit('users/setShowFileView', false)
            }
        },

        openedFile () {
            return this.$store.state.users.openedFile
        },

        isDoc() {
            return this.openedFile.name.includes('docx')
        }
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.toolbar {
    background-image: linear-gradient(to top right, #f9f9f9, #B3E5FC);
    font-family: Arial, Helvetica, sans-serif;
}

.file-frame {
    display: flex;
    margin: auto !important;
    height: 100vh;
    width: 100%;
}

</style>