<template>
    <div class="dialog-wrapper">
        <script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-element-bundle.min.js"></script>
        <v-dialog
            class="dialog"
            v-if="showSignupDialog"
            v-model="showSignupDialog"
            :width="windowWidth < 800 ? '90%' : '50%'"
        >
            <v-card class="dialog-card"
                elevation="5"
            >
                <swiper-container navigation="true" scrollbar="true">
                    <swiper-slide><InitialSwiper /></swiper-slide>
                    <swiper-slide><SignupSwiper /></swiper-slide>
                    <swiper-slide><StripeCard /></swiper-slide>
                </swiper-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import InitialSwiper from '~/components/InitialSwiper.vue'
import SignupSwiper from '~/components/SignupSwiper.vue'
import StripeCard from '~/components/StripeCard.vue'

export default {
    name: 'SignupDialog',

    created() {
        window.addEventListener('resize', this.resizeHandler)
    },

    components: {
        InitialSwiper,
        SignupSwiper,
        StripeCard,
    },

    data () {
        return {
            windowWidth: window.innerWidth,
        }
    },

    methods: {
        resizeHandler() {
            this.windowWidth = window.innerWidth
        }
    },

    computed: {
        showSignupDialog: {
            get() {
                return this.$store.state.users.showSignupDialog
            },

            set() {
                this.$store.commit('users/toggleSignupDialog', false)
            }
        }
    }

}
</script>

<style scoped>
@import '~/assets/styles.css';



</style>
