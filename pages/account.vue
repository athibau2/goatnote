<template>
    <v-app>
        <head>
          <script src='https://cdn.jsdelivr.net/npm/pdfmake@latest/build/pdfmake.min.js'></script>
          <script src='https://cdn.jsdelivr.net/npm/pdfmake@latest/build/vfs_fonts.min.js'></script>
        </head>
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
                <div v-if="userData.subscriptionstatus == 'inactive'">
                  <span style="display: flex; justify-content: center; align-items: center;">
                    <hr style="width: 40%;">
                    <span style="margin: 0 5px;">OR</span>
                    <hr style="width: 40%;">
                  </span>
                  <span>Upgrade to Receive:</span>
                  <ul class="feature-list">
                    <li v-for="(feature, i) in products[1].features" :key="i">
                      {{feature}}
                    </li>
                  </ul>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <a v-if="userData.subscriptionstatus == 'active'" :href="portal" style="text-decoration: none;">
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

          <!-- <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name">Export Data</v-card-title>
              <v-card-text class="card-text">
                Performing this function will download all of your data. This includes your notes, flashcards, whiteboards, and files. They will be grouped by your organizations and collections.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text class="flat-btn" :disabled="exporting" @click="exportData()">
                  <Loading v-if="exporting" /> {{exporting ? null : 'Export Data'}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row> -->

          <v-divider style="margin: 45px auto 20px auto; width: 500px;" />

          <v-row justify="center" align="center">
            <v-card class="account-card" elevation="1" outlined width="500">
              <v-card-title class="name" style="color: #E57373;">Danger</v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn text class="flat-btn" :disabled="loading" @click="deleteAccount()">
                  <Loading v-if="loading" /> {{loading ? null : 'Delete Account'}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
    </v-app>
</template>

<script>
import { stripePortal } from "../store/auth"
import Loading from '~/components/Loading.vue'
import html2pdf from 'html2pdf.js';
import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
const htmlToPdfmake = require("html-to-pdfmake");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: 'AccountPage',

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
    Loading
  },

  data () {
    return {
      exporting: false,
      confirmNewPass: "",
      newPass: "",
      show1: false,
      show2: false,
      loading: false,
      portal: stripePortal,
      payLink: process.env.NUXT_ENV_STRIPE_PAYMENT_LINK,
    }
  },

  methods: {
    async updatePass () {
      if (!this.passMatch) {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Passwords do not match.'
        })
      } else if (this.confirmNewPass === "" || this.newPass === "") {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'No field may be left empty.'
        })
      } else if (this.newPass.length < 6) {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'Your password must be at least 6 characters.'
        })
      } else {
        this.$store.dispatch('users/updatePass', {
          newPass: this.newPass,
        })
        this.confirmNewPass = ""
        this.newPass = ""
      }
    },

    async deleteAccount () {
      if (this.userData.subscriptionstatus == 'active') {
        await this.$store.commit('users/setAlert', {
            color: 'error',
            icon: '$error',
            text: 'You cannot delete your account while subscribed to the Premium plan. Please first cancel your subscription, then delete your account.'
        })
      } else if (confirm("Are you sure you want to delete your account?")) {
        this.loading = true
        await this.$store.dispatch('users/deleteAccount')
        this.loading = false
      }
    },

    async exportData() {
      this.exporting = true
      await this.$store.dispatch('users/exportData')
      const zipBlob = await this.createZip(this.organizedData)
      this.downloadZip(zipBlob);
      this.exporting = false
    },

    async createZip(organizedData) {
      const zip = new JSZip();

      for (const orgId in organizedData) {
        const org = organizedData[orgId];
        const orgFolder = zip.folder(org.orgname);

        for (const collectionId in org.collections) {
          const collection = org.collections[collectionId];
          const collectionFolder = orgFolder.folder(collection.collectionname);

          for (const noteId in collection.notes) {
            const note = collection.notes[noteId];
            const pdf = await this.noteToPdf(note);
            const blob = pdf;
            const fileName = note.notename.split(' ').join('-').split('/').join('-').split('\\').join('-').split(',').join('-') // remove spaces, commas, and slashes
            collectionFolder.file(`${fileName}.pdf`, blob);
          }
        }
      }
      return zip.generateAsync({ type: 'blob' });
    },

    async noteToPdf(note) {
      // const el = document.createElement('div');
      // el.innerHTML = note.typednotes;
      let notesHtml = `
        <div>
          ${note.typednotes}
        </div>
      `

      let flashcardsHtml = ``
      note.flashcards.forEach(card => {
        let cardHtml = `<p><b>${card.cardprompt}:</b>&ensp;${card.cardanswer}</p>`
        flashcardsHtml += cardHtml
      })

      let whiteboardsHtml = ``
      note.whiteboards.forEach(board => {
        let boardHtml = `<img src="${board.data}" /><br>`
        whiteboardsHtml += boardHtml
      })

      let html = htmlToPdfmake(`
        <div>
          ${notesHtml}
          <div>
            <h1>Flashcards</h1>
            ${flashcardsHtml}
          </div>
          <div>
            <h1>Whiteboards</h1>
            ${whiteboardsHtml}
          </div>
        </div>
      `);

      const dd = {content: html};
      const pdfBlob = await new Promise((resolve, reject) => {
        const pdfDoc = pdfMake.createPdf(dd);

        pdfDoc.getBuffer(buffer => {
          const blob = new Blob([buffer], { type: 'application/pdf' });
          resolve(blob);
        });
      });

      // // Add the flashcards
      // const flashcardList = document.createElement('ul');
      // note.flashcards.forEach(card => {
      //   const li = document.createElement('li');
      //   li.innerText = `Prompt: ${card.cardprompt}, Answer: ${card.cardanswer}`;
      //   flashcardList.appendChild(li);
      // });
      // el.appendChild(flashcardList);


      // const whiteboardList = document.createElement('ul');
      // note.whiteboards.forEach(board => {
      //   const img = document.createElement('img');
      //   img.src = board.data;
      //   whiteboardList.appendChild(img);
      // });
      // el.appendChild(whiteboardList);

      // Convert the element to a PDF
      // const pdf = await html2pdf().from(el).outputPdf();
      return pdfBlob;
    },

    async downloadZip(zipBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = "exported_data.zip";
      link.click();
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

    organizedData () {
      return this.$store.state.users.dataToExport
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
