<template>
    <v-app>
      
        <v-col v-if="(userData !== null && userData !== undefined)">
          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">
                  {{userData.firstname}} {{userData.lastname}}
              </v-card-title>
              <v-card-subtitle>
                  {{userData.email}}
              </v-card-subtitle>
              <v-card-text>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-5"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  v-model="currentPass" 
                  placeholder="Current Password"
                >
                </v-text-field>
                <v-text-field
                  class="selector"
                  dense
                  solo
                  rounded
                  background-color="light blue lighten-5"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                  v-model="newPass" 
                  placeholder="New Password"
                >
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="deleteAccount()">Delete Account</v-btn>
                <v-btn class="good-btn" @click="updatePass()">Update Password</v-btn>
              </v-card-actions>
            </v-card>
          </v-row>

          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">Current Subscription</v-card-title>
              <v-card-text class="card-text">
                {{ userData.subscriptionstatus == 'active' ?
                  'Premium Membership &ndash; $3.99 / month' : 'Basic Plan &ndash; Free'
                }}
              </v-card-text>
              <v-card-subtitle>
                <!-- TODO: ADD FEATURE LISTS HERE -->
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer />
                <a :href="portal" style="text-decoration: none;">
                  <v-btn text>Manage Your Account</v-btn>
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
        </v-col>
    </v-app>
</template>

<script>
import { stripePortal, getJwtToken, getUserIdFromToken } from "../store/auth"
import StripeCard from '~/components/StripeCard.vue'

export default {
  name: 'AccountPage',
  middleware: "auth",

  mounted () {
    this.$store.commit('users/setUser', getUserIdFromToken(getJwtToken()))
    this.$store.dispatch('users/userData')
    this.$store.dispatch('users/orgs')
  },

  components: {
    StripeCard
  },

  data () {
    return {
      currentPass: "",
      newPass: "",
      show1: false,
      show2: false,
      portal: stripePortal,
      payLink: process.env.NUXT_ENV_STRIPE_PAYMENT_LINK,

    }
  },

  methods: {
    updatePass () {
      if (this.currentPass === "" || this.newPass === "") alert('No field may be left empty')
      else {
        this.$store.dispatch('users/updatePass', {
          newPass: this.newPass,
          currentPass: this.currentPass
        })
        this.currentPass = ""
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
    user () {
      return this.$store.state.users.user
    },

    userData () {
        return this.$store.state.users.userData
    },

    encodedEmail () {
      return encodeURIComponent(this.user.email)
    }
  }
}
</script>

<style scoped>
@import '~/assets/styles.css';

.account-card {
  background-color: transparent;
  margin-top: 20px;
}

.selector {
  width: 70%;
  margin: auto;
}

.name {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 22px;
}

.card-text {
  font-size: 16px;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

</style>
