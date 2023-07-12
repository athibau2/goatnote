<template>
    <div class="dialog-wrapper">
        <v-dialog
            class="dialog"
            v-if="showLoginDialog"
            v-model="showLoginDialog"
            :width="windowWidth < 800 ? '90%' : '50%'"
        >
            <v-card class="dialog-card"
                elevation="5"
            >
                <v-card-title>
                    <span class="basic-header">
                        <em>Your Info...</em>
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        class="selector"
                        background-color="#f0f0f0"
                        dense
                        solo
                        rounded
                        v-model="email"
                        :append-icon="'mdi-email'"
                        placeholder="Enter your email"
                    >
                    </v-text-field>
                    <v-text-field
                        class="selector"
                        background-color="#f0f0f0"
                        dense
                        solo
                        rounded
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        v-model="password"
                        @keyup.enter="login()"
                        placeholder="Enter your password"
                    >
                    </v-text-field>
                    <center>
                        <NuxtLink to="/forgot-password">Forgot Password</NuxtLink>
                    </center>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="flat-btn" @click="switchToJoin()" text>Join Here</v-btn>
                    <v-btn nuxt
                        class="good-btn"
                        @click="login()"
                    >
                        Sign In
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'LoginDialog',

    created() {
        window.addEventListener('resize', this.resizeHandler)
        this.showLoginDialog = false
    },

    data () {
        return {
            email: "",
            password: "",
            show: false,
            windowWidth: window.innerWidth,
        }
    },

    methods: {
        login() {
            if (this.email === "" || this.password === "") alert('No field may be left empty')
            else {
                this.$store.dispatch('users/login', {
                email: this.email,
                password: this.password
                })
            }
        },

        async switchToJoin() {
            await this.$store.commit('users/toggleLoginDialog', false)
            await this.$store.commit('users/toggleSignupDialog', true)
        },

        resizeHandler() {
            this.windowWidth = window.innerWidth
        }
    },

    computed: {
        showLoginDialog: {
            get() {
                return this.$store.state.users.showLoginDialog
            },

            set() {
                this.$store.commit('users/toggleLoginDialog', false)
            }
        }
    }

}
</script>

<style scoped>
@import '~/assets/styles.css';


</style>
