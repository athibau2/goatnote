<template>
    <div class="signup-wrapper">
        <span class="basic-header">
            <em>Your Info...</em>
        </span>
        <v-text-field
            class="selector"
            background-color="#f0f0f0"
            dense
            solo
            rounded
            v-model="firstname"
            placeholder="First name"
            @input="updateSignupInfo()"
            :disabled="signUpWithGoogle"
        >
        </v-text-field>
        <v-text-field
            class="selector"
            background-color="#f0f0f0"
            dense
            solo
            rounded
            v-model="lastname"
            placeholder="Last name"
            @input="updateSignupInfo()"
            :disabled="signUpWithGoogle"
        >
        </v-text-field>
        <v-text-field
            class="selector"
            background-color="#f0f0f0"
            dense
            solo
            rounded
            v-model="email"
            :append-icon="'mdi-email'"
            placeholder="Enter your email"
            @input="updateSignupInfo()"
            :disabled="signUpWithGoogle"
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
            placeholder="Enter your password"
            @input="updateSignupInfo()"
            :disabled="signUpWithGoogle"
        >
        </v-text-field>
        <div class="checks">
            <input class="checkbox" type="checkbox" v-model="consented" />
            <span>
                I consent to the 
                <a target="_blank" href="https://deltaapps.dev/goatnotes/privacy_policy.pdf">Privacy Policy</a>
                and to the 
                <a target="_blank" href="https://deltaapps.dev/goatnotes/terms_conditions.pdf">Terms.</a>
            </span>
        </div>
        <div class="checks">
            <input class="checkbox" type="checkbox" v-model="verifiedAge" />
            <span>I certify that I am at least 13 years of age.</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignupSwiper',

    data () {
        return {
            firstname: '',
            lastname: '',
            email: "",
            password: "",
            show: false,
        }
    },

    methods: {
        updateSignupInfo() {
            this.$store.commit('users/setSignupInfo', {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            })
        },

        async toggleSignUpWithGoogle() {
            await this.$store.commit('users/toggleSignUpWithGoogle')
        },
    },

    computed: {
        signUpWithGoogle: {
            get() {
                return this.$store.state.users.signUpWithGoogle
            },

            async set() {
                await this.$store.commit('users/toggleSignUpWithGoogle')
            }
        },

        consented: {
            get() {
                return this.$store.state.users.consented
            },

            async set() {
                await this.$store.commit('users/toggleConsented')
            }
        },

        verifiedAge: {
            get() {
                return this.$store.state.users.verifiedAge
            },

            async set() {
                await this.$store.commit('users/toggleVerifiedAge')
            }
        },
    }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.signup-wrapper {
    width: 70%;
    padding: 30px 0;
    margin: auto;
}

.headline {
    color: #2F2B28;
}

.selector {
    width: 89%;
}

.good-btn {
    float: right;
    margin-bottom: 30px;
}

.line-container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 15px; */
}

.line-label {
  margin: 0 5px;
}

#google-checkbox {
    height: 25px;
    width: 25px;
}

.checkbox {
    height: 15px;
    width: 15px;
    margin-right: 5px;
}

.checks {
    margin: 5px;
    display: flex;
}

</style>