<template>
    <v-app>
        <v-col v-if="(userData !== null && userData !== undefined)">
          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">
                  {{userData.firstname}} {{userData.lastname}}
              </v-card-title>
              <v-card-subtitle class="subtitle">
                {{userData.email}}
                <p v-if="supabaseUser">
                  Sign in provider:&ensp;{{providers?.join(', ')}}
                </p>
              </v-card-subtitle>
              <v-card-text v-if="providers?.includes('email')">
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-5"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  v-model="newPass" 
                  placeholder="New Password"
                >
                </v-text-field>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  :background-color="passMatch ? 'light blue lighten-5' : 'light red lighten-3'"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                  @keypress.enter="updatePass()"
                  v-model="confirmNewPass" 
                  placeholder="Confirm New Password"
                >
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text class="flat-btn" @click="deleteAccount()">Delete Account</v-btn>
                <v-btn class="good-btn" v-if="providers?.includes('email')" @click="updatePass()">Update Password</v-btn>
              </v-card-actions>
            </v-card>
          </v-row>

          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">Current Subscription</v-card-title>
              <v-card-text class="card-text">
                {{ userData.subscriptionstatus == 'active' ?
                  'Premium Membership &ndash; '+ products[1].price : 'Basic Plan &ndash; '+ products[0].price
                }}
                <ul class="feature-list">
                  <li v-for="(feature, i) in userData.subscriptionstatus == 'inactive' ? products[0].features : products[1].features" :key="i">
                    {{feature}}
                  </li>
                </ul>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <a :href="portal" style="text-decoration: none;">
                  <v-btn text class="flat-btn">Manage Your Account</v-btn>
                </a>
                <a
                  v-if="userData.subscriptionstatus == 'inactive'"
                  style="text-decoration: none;"
                  :href="`${payLink}?prefilled_email=${encodedEmail}`"
                >
                  <v-btn class="good-btn">Upgrade</v-btn>
                </a>
              </v-card-actions>
            </v-card>
          </v-row>

          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">Notification Settings</v-card-title>
              <v-card-text class="card-text">
                <v-switch
                  color="#85c59d"
                  v-model="notifSettings"
                  label="Study Plan Reminders"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-row>
        </v-col>
    </v-app>
</template>

<script>
import { stripePortal } from "../store/auth"
import StripeCard from '~/components/StripeCard.vue'

export default {
  name: 'AccountPage',
  middleware: "auth",

  head() {
    return {
      title: 'Account - GOAT Notes',
      meta: [
        { hid: 'account-description', name: 'description', content: 'See your account details on GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, account settings' }
      ]
    }
  },

  components: {
    StripeCard
  },

  data () {
    return {
      confirmNewPass: "",
      newPass: "",
      show1: false,
      show2: false,
      portal: stripePortal,
      payLink: process.env.NUXT_ENV_STRIPE_PAYMENT_LINK,
    }
  },

  methods: {
    updatePass () {
      if (!this.passMatch) {
        alert('Passwords do not match.')
      } else if (this.confirmNewPass === "" || this.newPass === "") {
        alert('No field may be left empty')
      } else if (this.newPass.length < 6) {
        alert('Your password must be at least 6 characters')
      } else {
        this.$store.dispatch('users/updatePass', {
          newPass: this.newPass,
        })
        this.confirmNewPass = ""
        this.newPass = ""
      }
    },

    deleteAccount () {
      if (this.userData.subscriptionstatus == 'active') {
        alert('You cannot delete your account while subscribed to the Premium plan. Please first cancel your subscription, then delete your account.')
      } else if (confirm("Are you sure you want to delete your account?")) {
        this.$store.dispatch('users/deleteAccount')
      }
    }
  },

  computed: {
    userData () {
        return this.$store.state.users.userData
    },

    supabaseUser () {
      return this.$store.state.users.supabaseUser
    },

    supabaseSession () {
      return this.$store.state.users.supabaseSession
    },

    providers () {
      return this.supabaseUser?.app_metadata?.providers
    },

    products () {
      return this.$store.state.users.products
    },

    passMatch () {
      return this.confirmNewPass == this.newPass
    },

    notifSettings: {
      get () {
        return this.userData.notifsettings
      },

      set () {
        this.$store.dispatch('users/updateNotifSettings')
      }
    },

    encodedEmail () {
      return encodeURIComponent(this.userData.email)
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.account-card {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  background-color: transparent;
  margin-top: 20px;
}

.selector {
  width: 70%;
  margin: auto;
}

.name {
  font-size: 22px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 16px;
}

.card-text {
  font-size: 18px;
}

.flat-btn {
  font-size: 15px !important;
}

.good-btn {
  font-size: 15px !important;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  font-size: 14px;
  margin-top: 10px;
}

</style>
