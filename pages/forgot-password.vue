<template>
    <v-row justify="center" align="center">
        <v-col class="text-center">
            <span class="basic-header">
                To recover your account, enter your email below.
                <br>A link to login will be sent to you.
            </span>

            <form class="form" @submit.prevent="getEmail">
                <input class="form-field" type="email" v-model="email" placeholder="Enter your email" required />
                <v-btn type="submit" :disabled="email === ''" text>Get Email</v-btn>
            </form>
        </v-col>
        <LoginDialog style="margin: auto;" />
    </v-row>
</template>

<script>
import LoginDialog from '~/components/LoginDialog.vue'

export default {
    name: 'ForgotPassword',
    layout: 'noauth',

    components: {
        LoginDialog,
    },

    data () {
        return {
            email: '',
        }
    },

    methods: {
        async getEmail() {
            await this.$store.dispatch('users/sendMagicLink', {
                email: this.email
            })
            this.email = ''
        },
    },

    computed: {
    },
}
</script>

<style scoped>
@import '~/assets/styles.css';

.basic-header {
    width: 60% !important;
    margin: 20px 0;
}

.form {
    margin: 20px 0;
}

.form-field {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color: #EBEBEB;
    border: solid gray;
    border-radius: 6px;
    width: 250px;
    padding: 6px;
}

</style>
