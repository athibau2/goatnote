<template>
    <div class="stripe-wrapper">
        <h3 class="text-center" style="font-size: 20px">Choose a Plan</h3>
        <v-row class="products-row justify-center">
            <span v-for="(product, i) in products" :key="i">
                <v-card class="payment-card text-center"
                    :style="product.name == 'Premium' ? {
                        'border': 'solid #A5D6A7 3px'
                    } : null"
                >
                    <div class="square">
                        <img class="payment-logo" src="~/assets/logos/GN.png" />
                    </div>
                    <v-card-text>
                        <h3>GOAT Notes {{product.name}}</h3>
                        <h4>{{product.price}}</h4>
                    </v-card-text>
                    <v-btn class="payment-btn"
                        elevation="1"
                        @click="signup(product.paymentLink)"
                        :disabled="!consented || !verifiedAge"
                    >
                        Subscribe
                    </v-btn>
                    <v-card-text>
                        <h4>Features:</h4>
                        <ul class="feature-list text-left">
                            <li v-for="(feature, i) in product.features" :key="i">{{feature}}</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </span>
        </v-row>
    </div>
</template>

<script>
export default {
   name: 'StripeCard',

   data () {
    return {
        products: this.$store.state.users.products
    }
   },

   methods: {
    async signup(link) {
        if (this.signupInfo.firstname === "" || this.signupInfo.lastname === ""
            || this.signupInfo.email === "" || this.signupInfo.password === "") {
            alert('No field may be left empty')
        } else {
            const success = await this.$store.dispatch('users/signup', {
                firstname: this.signupInfo.firstname,
                lastname: this.signupInfo.lastname,
                email: this.signupInfo.email,
                password: this.signupInfo.password
            })
            link ? success ? window.location.href = `${link}?prefilled_email=${this.encodedEmail}` : null : null
        }
    },
   },

   computed: {
    consented () {
        return this.$store.state.users.consented
    },

    verifiedAge () {
        return this.$store.state.users.verifiedAge
    },

    signupInfo () {
        return this.$store.state.users.signupInfo
    },

    encodedEmail () {
      return encodeURIComponent(this.$store.state.users.user.email)
    }
   }
}
</script>

<style scoped>

.stripe-wrapper {
    padding: 20px 0;
    max-height: 400px;
    overflow-y: scroll;
}

.products-row {
  margin: 20px;
}

.payment-card {
    margin: 5px;
    padding: 15px;
    width: 275px;
}

.square {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 100px;
    width: 100px;
    background-color: #f9f9f9;
    border-radius: 10px;
}

.payment-logo {
    max-height: 90%;
    max-width: 90%;
}

h3 {
    font-weight: 400;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 18px;
}

h4 {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

ul {
    max-height: 100px;
    overflow-y: scroll;
}

.payment-btn {
    background-color: #85c59d !important;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    width: 80%;
}

.feature-list {
    font-size: 13px;
    list-style: square;
}

</style>