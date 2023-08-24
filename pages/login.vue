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

        <h2 class="basic-header text-center"
          v-if="windowWidth > 900"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          Why Choose Us?
        </h2>
        <h3 v-else>Why Choose Us?</h3>

        <v-row class="key-feature-row">
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
        </v-row>

        <h2 class="basic-header text-center"
          v-if="windowWidth > 900"
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          See How It Works
        </h2>
        <h3 v-else>See How It Works</h3>

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
          <details class="faq-item" v-for="(faq, i) in faqs" :key="i">
            <summary class="faq-title">{{faq.title}}</summary>
            <p class="faq-text">{{faq.text}}</p>
          </details>
        </div>
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
      introFeatures: [
        {
          title: 'AI',
          icon: 'mdi-brain',
          text: 'Use AI to create flashcards faster'
        },
        {
          title: 'Draw',
          icon: 'mdi-draw',
          text: 'Handwrite your notes on a whiteboard'
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
      ],
      faqs: [
        {
          title: 'How is this better than other note-taking options?',
          text: 'We understand that there are many ways to take notes and study. However, we provide multiple tools that make note-taking and studying much easier, faster, and more helpful than anything else!'
        },
        {
          title: 'How does the AI create my flashcards?',
          text: 'As you take notes, you can store any number of words or phrases in a queue. When you\'re ready, you can send that list to the AI, which will define all the words and create helpful study questions to test your knowledge and memory!'
        },
        {
          title: 'What if I want to study my friends notes?',
          text: 'With GOAT Notes, you can do that! You can share your notes with others to collaborate on as many study tools as you want!'
        },
        {
          title: 'How much does it cost?',
          text: 'GOAT Notes is free to join! There are many features you can use at no cost. However, some features, such as using AI to create your flashcards, are saved for the Premium plan, which is only $2.99 / month.'
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
}

.key-feature-card {
  border-radius: 10px;
  box-shadow: 0px 0px 6px #2b8f2b;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
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
  margin: auto;
  justify-content: center;
  width: 50%;
  padding: 5px;
}

.faq-item {
  margin: 4px;
  padding: 6px;
  border: solid 1px #B3E5FC;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 0px 8px #B3E5FC;
  font-family: Arial, Helvetica, sans-serif;
  opacity: 0.8;
}

.faq-title {
  font-size: 18px;
}

.faq-text {
  font-size: 16px;
  margin: 8px;
}

</style>
