<template>
  <v-app style="background-color: #f9f9f9;">
    <v-row justify="center" align="center">
      <v-col class="intro-page"
        :cols="windowWidth > 800 ? '10' : null"
      >
        <div class="full-intro"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          <h3 class="text-center" v-if="windowWidth >= 900"
          >
            All Your Study Tools in One Place
          </h3>
          <h4 class="text-center" style="font-size: 22px" v-else-if="windowWidth < 900"
          >
            All Your Study Tools in One Place
          </h4>
          <RotateText class="intro" />
        </div>

        <v-btn class="good-btn"
          :style="windowWidth < 600 ? {
            'width': '90%'
          } : null"
          @click="toggleSignupDialog()"
          data-aos="zoom-in"
          data-aos-duration="1500"
        >
          Get Started
        </v-btn>

        <h2 class="basic-header text-center"
          v-if="windowWidth > 900"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          See What We Do
        </h2>
        <h3 v-else>See What We Do</h3>
        <v-divider />

        <!-- Large Screen repeating card -->
        <div v-if="windowWidth >= 900">
          <div v-for="(card, i) in introCards"
            :key="i"
          >
            <v-row class="intro-rows" align="center">
              <v-col v-if="i == 0 || i % 2 == 0"
                cols="4"
                data-aos="fade-right"
                data-aos-duration="800"
              >
                <span class="intro" :style="windowWidth > 1300 ? {'font-size': '24px'} : null">
                  {{ card.description }}
                </span>
              </v-col>
              <v-col cols="8"
                :data-aos="i == 0 || i % 2 == 0 ? 'fade-left' : 'fade-right'"
                data-aos-duration="800"
              >
                <img class="intro-img" :src="require(`~/assets/images/${card.img}`)" width="100%">
              </v-col>
              <v-col v-if="i != 0 && i % 2 != 0"
                cols="4"
                data-aos="fade-left"
                data-aos-duration="800"
              >
                <span class="intro" :style="windowWidth > 1300 ? {'font-size': '24px'} : null">
                  {{ card.description }}
                </span>
              </v-col>
            </v-row>
            <v-divider class="intro-divider" />
          </div>
        </div>

        <!-- Small screen repeating card -->
        <div v-else-if="windowWidth < 900">
          <div v-for="(card, i) in introCards" :key="i">
            <v-row class="intro-rows" align="center" justify="center" >
              <v-col>
                <p class="intro text-center" :style="windowWidth > 1300 ? {'font-size': '24px'} : null">
                  {{ card.description }}
                </p>
                <img class="intro-img" :src="require(`~/assets/images/${card.img}`)" width="100%">
              </v-col>
            </v-row>
            <v-divider class="intro-divider" />
          </div>
        </div>
        <v-btn class="good-btn"
          :style="windowWidth < 600 ? {
            'width': '90%'
          } : null"
          @click="toggleSignupDialog()"
          data-aos="zoom-in"
          data-aos-duration="1500"
        >
          Get Started
        </v-btn>
      </v-col>
    </v-row>
    
    <SignupDialog style="margin: auto;" />
    <LoginDialog style="margin: auto;" />

  </v-app>
</template>

<script>
import StripeCard from '~/components/StripeCard.vue'
import SignupDialog from '~/components/SignupDialog.vue'
import LoginDialog from '~/components/LoginDialog.vue'
import RotateText from '~/components/RotateText.vue'
import aosMixin from '~/mixins/aos'

export default {
  name: 'LoginPage',
  layout: 'noauth',
  mixins: [aosMixin],

  created() {
    window.addEventListener('resize', this.resizeHandler)
  },

  components: {
    StripeCard,
    SignupDialog,
    LoginDialog,
    RotateText
  },

  data () {
    return {
      introIndex: 0,
      introPhrases: [
        "note-taking.",
        "studying."
      ],
      introCards: [
        {
          img: 'note.png',
          description: 'Create collections to organize your notes. In your notes, you have a dedicated space for flashcards, whiteboard drawings, files, helpful links, and study plans!',
        },
        {
          img: 'goatnotes-ai.gif',
          description: 'AI is your study buddy. You can utilize our AI tools to generate flashcards based off your notes!',
        },
        {
          img: 'goatnotes-study.gif',
          description: 'When it\'s time to study, the study mode button changes the layout of your Study Tools to help you study your flashcards!',
        },
        {
          img: 'share.png',
          description: 'Sharing notes is even easier now! Share entire collections or just individual notes with those in your organization; they can even add to your study tools!',
        },
        {
          img: 'shared-with-me.png',
          description: 'The Shared With Me page shows all of the collections and notes you have access to. You can\'t change the typed notes, but you can add to and study the flashcards and other Study Tools!',
        },
      ],
      windowWidth: window.innerWidth,
    }
  },

  methods: {
    toggleSignupDialog() {
      this.$store.dispatch('users/toggleSignupDialog')
    },

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
  },

}
</script>

<style scoped>
@import '~/assets/styles.css';

.intro-page {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.full-intro {
  padding: 15px;
  background-color: transparent;
  border-radius: 100px;
  box-shadow: 0px 0px 2px #2F2B28;
  margin-bottom: 60px;
}

h3, h4 {
  font-weight: 400;
  font-size: 26px;
  color: #2F2B28;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.intro {
  font-size: 22px;
  color: #2F2B28;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.basic-header {
  font-weight: 300;
  font-size: 26px;
  margin-top: 50px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.intro-rows {
  margin-top: 20px;
}

.intro-divider {
  margin: 50px;
}

.intro-img {
  border-radius: 10px;
  box-shadow: 0px 0px 4px #2F2B28;
}

.good-btn {
  width: 400px;
  height: 50px !important;
  font-size: 18px;
  color: #2F2B28 !important;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  border-radius: 10px;
  box-shadow: 0px 0px 8px #2b8f2b;
  margin: 20px auto;
  display: grid;
}

</style>
