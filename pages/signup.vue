<template>
    <v-app>
        <v-row>
            <v-col class="intro-page" cols="8">
                <div class="full-intro">
                    <h3 class="text-center">GOAT Notes is your one stop for academic success!</h3>
                    <div class="intro text-center">
                         No more wasted time in 
                            <div class="slidingVertical">
                                <span><b>note-taking.</b></span>
                                <span><b>studying.</b></span>
                            </div>
                    </div>
                </div>
                <v-divider class="intro-divider" />

                <!-- Row 1 -->
                <v-row class="intro-rows" align="center">
                    <v-col cols="4">
                        <span class="intro">
                            Join or create organizations to connect and share notes with friends and peers!
                        </span>
                    </v-col>
                    <v-col cols="8">
                        <img class="intro-img" src="~/assets/home.png" height="250px" width="500px">
                    </v-col>
                </v-row>

                <v-divider class="intro-divider" />

                <!-- Row 2 -->
                <v-row class="intro-rows" align="center">
                    <v-col cols="8">
                        <img class="intro-img" src="~/assets/note.png" height="250px" width="500px">
                    </v-col>
                    <v-col cols="4">
                        <span class="intro">
                            Create collections to organize your notes. In your notes, you have a dedicated space for vocab words, study questions, links to helpful content, and study plans!
                        </span>
                    </v-col>
                </v-row>

                <v-divider class="intro-divider" />

                <!-- Row 3 -->
                <v-row class="intro-rows" align="center">
                    <v-col cols="4">
                        <span class="intro">
                            When it's time to study, the study mode button changes the layout of your notes page and lets you review your vocab words and study questions as flashcards!
                        </span>
                    </v-col>
                    <v-col cols="8">
                        <img class="intro-img" src="~/assets/goatnotes-study.gif" height="250px" width="500px">
                    </v-col>
                </v-row>

                <v-divider class="intro-divider" />
                
                <!-- Row 4 -->
                <v-row class="intro-rows" align="center">
                    <v-col cols="8">
                        <img class="intro-img" src="~/assets/plans.png" height="250px" width="500px">
                    </v-col>
                    <v-col cols="4">
                        <span class="intro">
                            Keep track of which notes you haven't studied yet on the My Study Plans page!
                        </span>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Sign up Form -->
            <v-col cols="4">
                <v-row justify="center" align="center">
                    <v-card class="card" elevation="5" width="350">
                        <v-card-title class="headline" style="color: #575757">
                            <em>Sign Up Here</em>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field
                                class="selector"
                                background-color="#f0f0f0"
                                dense
                                solo
                                rounded
                                v-model="firstname"
                                placeholder="First name"
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
                            >
                            </v-text-field>
                            <v-text-field
                                class="selector"
                                background-color="#f0f0f0"
                                dense
                                solo
                                rounded
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1"
                                v-model="password"
                                placeholder="Enter your password"
                            >
                            </v-text-field>
                            <v-text-field
                                class="selector"
                                background-color="#f0f0f0"
                                dense
                                solo
                                rounded
                                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show2 ? 'text' : 'password'"
                                @click:append="show2 = !show2"
                                v-model="confirmPass"
                                @keyup.enter="signup()"
                                placeholder="Confirm your password"
                            >
                            </v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <nuxt-link to="/login">Sign In</nuxt-link>
                            <span>&nbsp;</span>
                            <v-btn color="#abddd0" nuxt @click="signup()">
                                Sign Up
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-row>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
export default {
  name: 'SignupPage',
  layout: 'noauth',

  data () {
    return {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPass: "",
        show1: false,
        show2: false,
    }
  },

  methods: {
    signup() {
        if (this.firstname === "" || this.lastname === "" || this.email === "" 
            || this.password === "" || this.confirmPass === "") {
            alert('No field may be left empty')
        } else if (this.password !== this.confirmPass) {
            alert('Provided passwords do not match.')
        } else {
            this.$store.dispatch('users/signup', {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            })
        }
    },
  },

  computed: {
    user () {
      return this.$store.state.users.user
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

/*Vertical Sliding*/
.slidingVertical{
	display: inline;
	text-indent: 8px;
}
.slidingVertical span{
	animation: topToBottom 12.5s linear infinite 0s;
	-webkit-animation: topToBottom 12.5s linear infinite 0s;
	color: #385b69;
	opacity: 0;
	overflow: hidden;
	position: absolute;
}
.slidingVertical span:nth-child(2){
	animation-delay: 2.5s;
	-webkit-animation-delay: 2.5s;
}

/*topToBottom Animation*/
@-moz-keyframes topToBottom{
	0% { opacity: 0; }
	5% { opacity: 0; -moz-transform: translateY(-50px); }
	10% { opacity: 1; -moz-transform: translateY(0px); }
	25% { opacity: 1; -moz-transform: translateY(0px); }
	30% { opacity: 0; -moz-transform: translateY(50px); }
	80% { opacity: 0; }
	100% { opacity: 0; }
}
@-webkit-keyframes topToBottom{
	0% { opacity: 0; }
	5% { opacity: 0; -webkit-transform: translateY(-50px); }
	10% { opacity: 1; -webkit-transform: translateY(0px); }
	25% { opacity: 1; -webkit-transform: translateY(0px); }
	30% { opacity: 0; -webkit-transform: translateY(50px); }
	80% { opacity: 0; }
	100% { opacity: 0; }
}

.card {
  background-color: #faf9e2;
  position: fixed;
  top: 15%;
  right: 30px;
  animation: fadeInAnimation ease 2s;
  opacity: 0;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}

.full-intro {
  background-color: #faf9e2;
  border-radius: 20px;
  box-shadow: 0px 0px 6px #575757;
}

h3 {
  font-size: 25px;
  color: #575757;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.intro {
  font-size: 20px;
  color: #575757;
  font-family: Cochin;
}

.intro-rows {
  margin-top: 10px;
}

.intro-divider {
  margin-top: 10px;
}

.intro-img {
  border-radius: 10px;
  box-shadow: 0px 0px 4px #575757;
}


</style>