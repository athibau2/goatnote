<template>
  <v-app style="background-color: #f9f9f9;">
    <v-row justify="center" align="center">
      <v-col class="intro-page"
        :cols="windowWidth > 800 ? '10' : null"
        style="margin-bottom: 50px"
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

        <span class="basic-header text-center"
          style="display: flex; justify-content: center;"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          Why Choose Us?
        </span>

        <div class="key-feature-row">
          <div class="key-feature-card"
            v-for="(feat, i) in introFeatures"
            :key="i"
            data-aos="fade-up"
            data-aos-duration="1500"
            :data-aos-delay="i * 200"
          >
            <div class="key-feature-card-content">
              <span class="key-feature-card-header">{{feat.title}}</span>
              <v-icon class="key-feature-card-icon" size="45">{{feat.icon}}</v-icon>
              <p class="key-feature-card-text text-center">{{feat.text}}</p>
            </div>
          </div>
        </div>

        <span class="basic-header text-center"
          style="display: flex; justify-content: center;"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          See How It Works
      </span>

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
            <v-divider class="intro-divider" v-if="i != introCards.length - 1" />
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
            <v-divider class="intro-divider" v-if="i != introCards.length - 1" />
          </div>
        </div>

        <v-btn class="good-btn"
          :style="{ 'width': windowWidth < 600 ? '90%' : null, 'margin': '80px auto 50px auto' }"
          @click="toggleSignupDialog()"
          data-aos="zoom-in"
          data-aos-duration="1500"
        >
          Get Started
        </v-btn>

        <span class="basic-header" style="display: flex; justify-content: center;">FAQ</span>
        <div class="faq-wrapper text-center"
          :style="{'width': windowWidth < 700 ? '100%' : windowWidth < 1265 ? '75%' : null}"
        >
          <v-expansion-panels class="expand-group main-white text-font"
            data-aos="fade-in"
            data-aos-duration="2500"
          >
            <v-expansion-panel
              class="faq-item"
              v-for="(faq, i) in faqs"
              :key="i"
            >
              <v-expansion-panel-header>
                <span>{{ faq.title }}</span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>{{ faq.text }}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-col>
    </v-row>
    
    <SignupDialog style="margin: auto;" />
    <LoginDialog style="margin: auto;" />

    <!-- Bottom buffer -->
    <div style="margin-bottom: 30px;"></div>

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
  middleware: "google",

  head() {
    return {
      title: 'Login - GOAT Notes',
      meta: [
        { hid: 'login-description', name: 'description', content: 'Login to your account on GOAT Notes' },
        { hid: 'keywords', name: 'keywords', content: 'goat, notes, study, ai, artificial intelligence, login, landing page, signup' }
      ]
    }
  },

  async created() {
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
      introFeatures: [
        {
          title: 'AI',
          icon: 'mdi-brain',
          text: 'Use AI to create flashcards and quizzes'
        },
        {
          title: 'Draw',
          icon: 'mdi-draw',
          text: 'Handwrite your notes or draw diagrams'
        },
        {
          title: 'Share',
          icon: 'mdi-share',
          text: 'Easily collaborate on notes with your peers'
        },
        {
          title: 'Reminders',
          icon: 'mdi-calendar-alert',
          text: 'Get reminders for your study plans'
        },
      ],
      introCards: [
        {
          img: 'text-draw.gif',
          description: 'In your notes, you have the best of both worlds. Take notes with our text editor, or draw your notes with our advanced whiteboard!',
        },
        {
          img: 'ai-flashcards.gif',
          description: 'AI is your study buddy. You can utilize our AI tools to quickly generate helpful flashcards from your Flashcard Queue!',
        },
        {
          img: 'study-mode.gif',
          description: 'When it\'s time to study, the study mode button changes the layout of your Study Tools so you can study more effectively without leaving the page!',
        },
        {
          img: 'flashcard-deck-ai.gif',
          description: 'You can also create entire flashcard decks using AI. Just enter a topic, select the number of cards you want, and let it do its magic!'
        },
      ],
      faqs: [
        {
          title: 'How is this better than other note-taking options?',
          text: 'Everyone takes notes and studies in different ways. GOAT Notes provides more tools than any other platform, giving you flexibility in your studies. GOAT Notes makes it easier and faster to achieve your success.'
        },
        {
          title: 'How does the AI work?',
          text: 'Powered by GPT, you can use AI in GOAT Notes in various ways. You can send a list of words to receive flashcards for, you can input a topic you want flashcards for, or you can also send a topic and have the AI create a quiz for you!'
        },
        {
          title: 'Can I share my notes with friends?',
          text: 'With GOAT Notes, you can do that! You can share your notes with others to collaborate on as many study tools as you want!'
        },
        {
          title: 'How much does it cost?',
          text: 'GOAT Notes is free to join! There are many features you can use at no cost. However, some features, such as AI-generated flashcards and quizzes, are saved for the Premium plan, which is only $2.99 / month.'
        },
        {
          title: 'Are you adding more features?',
          text: 'Yes! We are always seeking to improve this site based on the needs of the users. Let us know what you think is missing!'
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
    },

    supabaseUser () {
      return this.$store.state.users.supabaseUser
    },

    supabaseSession () {
      return this.$store.state.users.supabaseSession
    },
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
  padding: 30px;
  background-color: transparent;
  border-radius: 100px;
  box-shadow: 0px 0px 2px #2F2B28;
  margin: 40px 0 60px 0;
  letter-spacing: 1px;
}

h3, h4 {
  font-weight: 400;
  font-size: 26px;
  color: #2F2B28;
  letter-spacing: 1px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.intro {
  font-size: 22px;
  color: #2F2B28;
  letter-spacing: 1px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.key-feature-row {
  margin: 50px 10px 60px 10px;
  justify-content: space-evenly;
  display: flex;
  flex-wrap: wrap;
}

.key-feature-card {
  border-radius: 10px;
  box-shadow: 0px 0px 6px #2b8f2b;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 2px;
}

.key-feature-card-content {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.key-feature-card-header {
  font-size: 24px;
  letter-spacing: 1px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.key-feature-card-icon {
  margin: 10px;
}

.key-feature-card-text {
  font-size: 16.5px;
  letter-spacing: 1px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.basic-header {
  font-weight: 300;
  font-size: 30px;
  margin-top: 50px;
  letter-spacing: 1px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.intro-rows {
  margin-top: 40px;
}

.intro-divider {
  margin: 60px;
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

.faq-wrapper {
  margin: 0 auto 20px auto;
  justify-content: center;
  width: 50%;
  padding: 5px;
}

.faq-item {
  margin: 5px;
  border: solid 1px #B3E5FC;
  box-shadow: 0px 0px 8px #B3E5FC;
  font-family: Arial, Helvetica, sans-serif;
}

.faq-title {
  font-size: 18px;
}

.faq-text {
  font-size: 16px;
  margin: 8px;
}

</style>
