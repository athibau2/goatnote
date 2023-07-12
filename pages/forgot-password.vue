<template>
    <v-row>
        <v-col class="col">
            <h2 class="header">Get A Code</h2>
            <form @submit.prevent="getCode">
                <input class="form-field" type="email" v-model="email" placeholder="Enter your email" required />
                <v-btn type="submit" :disabled="email === ''" text>Get Code</v-btn>
            </form>

            <form id="code-form" @submit.prevent="checkCode" v-if="resetCode != null">
                <input :class="codeWorked ? 'form-success' : 'form-field'" type="password" v-model="code" placeholder="Enter code" required />
                <v-btn type="submit" v-if="!codeWorked" :disabled="code === ''" text>Submit</v-btn>
                <v-icon size="40" id="check-icon" v-if="codeWorked">mdi-check</v-icon>
            </form>
        </v-col>

        <v-col v-if="codeWorked">
            <h2 class="header">Reset Your Password</h2>
            <form id="pass-form" @submit.prevent="resetPass">
                <input class="form-field" type="password" v-model="pass" placeholder="Enter password" required />
                <br>
                <input class="form-field" id="confirm-pass" type="password" v-model="confirmPass" placeholder="Confirm password" required />
                <v-btn type="submit" :disabled="pass === '' || confirmPass === '' || pass !== confirmPass" text>Submit</v-btn>
                <br>
                <span>
                    Passwords Match 
                    <v-icon>
                        {{(pass !== '' && confirmPass !== '' && pass === confirmPass) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}}
                    </v-icon>
                </span>
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
            code: '',
            pass: '',
            confirmPass: '',
            codeWorked: false,
        }
    },

    methods: {
        async getCode() {
            this.codeWorked = false
            await this.$store.dispatch('users/getPassResetCode', {
                email: this.email
            })
        },

        async checkCode() {
            if (this.code !== this.resetCode.code || this.email !== this.resetCode.codeemail) {
                alert('The code you provided is incorrect.')
            } else if (Date.now() > this.resetCode.codeexpiration) {
                alert('This code has expired, please request a new one.')
            } else if (this.code === this.resetCode.code && this.email === this.resetCode.codeemail) {
                this.codeWorked = true
            }
        },

        async resetPass() {
            if (this.pass !== this.confirmPass) {
                alert('Passwords do not match')
            } else {
                await this.$store.dispatch('users/resetPass', {
                    email: this.resetCode.codeemail,
                    password: this.confirmPass,
                })
                this.pass = ''
                this.confirmPass = ''
                this.email = ''
                this.code = ''
                this.codeWorked = false
            }
        },
    },

    computed: {
        resetCode () {
            return this.$store.state.users.resetCode
        }
    },
}
</script>

<style scoped>
@import '~/assets/styles.css';

.col {
    margin-left: auto;
}

.header {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 28px;
    color: #303030;
}

.form-field {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color: #EBEBEB;
    border: solid gray;
    border-radius: 6px;
    width: 250px;
    padding: 6px;
}

#code-form, #confirm-pass {
    margin-top: 20px;
}

.form-success {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    background-color: #EBEBEB;
    border: solid #18a937;
    border-radius: 6px;
    width: 250px;
    padding: 6px;
}

#check-icon {
    color: #18a937;
}

</style>
