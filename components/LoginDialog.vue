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
                        <div>
                            <!-- <v-btn class="flat-btn"
                                elevation="1"
                                style="margin-top: 20px; font-size: 14px !important;"
                                @click="signInWithGoogle()"
                                :disabled="loadingGoogle"
                            >
                                <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" height="25px" />
                                &ensp;
                                <Loading v-if="loadingGoogle" /> {{loadingGoogle ? null : 'Sign In With Google'}}
                            </v-btn> -->
                            <br>
                            <span class="basic-header" style="padding: 10px;">Google Sign-in Coming Soon</span>
                        </div>
                    </center>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn class="flat-btn" @click="switchToJoin()" text>Join Here</v-btn>
                    <v-btn nuxt
                        class="good-btn"
                        @click="login()"
                        :disabled="loading"
                    >
                        <Loading v-if="loading" /> {{loading ? null : 'Sign In'}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Loading from '~/components/Loading.vue'
export default {
    name: 'LoginDialog',

    components: {
        Loading,
    },

    created() {
        window.addEventListener('resize', this.resizeHandler)
        this.showLoginDialog = false
    },

    data () {
        return {
            email: "",
            password: "",
            show: false,
            loading: false,
            loadingGoogle: false,
            windowWidth: window.innerWidth,
        }
    },

    methods: {
        async login() {
            if (this.email === "" || this.password === "") alert('No field may be left empty')
            else {
                this.loading = true
                await this.$store.dispatch('users/login', {
                    email: this.email,
                    password: this.password
                })
                this.loading = false
            }
        },

        async switchToJoin() {
            await this.$store.commit('users/toggleLoginDialog', false)
            await this.$store.commit('users/toggleSignupDialog', true)
        },

        async signInWithGoogle() {
            this.loadingGoogle = true
            await this.$store.dispatch('users/googleSignin')
            this.loadingGoogle = false
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
