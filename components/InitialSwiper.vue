<template>
    <div class="initial-wrapper text-center">
        <img class="logo" src="~/assets/logos/GN.png" />
        <h2 class="basic-header text-center">Welcome, new friend!</h2>
        <p class="description">
            We're so glad you're here. We hope your experience with GOAT Notes is transformative to your life.
        </p>
        <p class="description">
            Continue on to sign up and select a plan, and we'll get you on your way!
        </p>
        <br>
        <p>
            #HappyLearning
        </p>
    </div>
</template>

<script>
export default {
    name: 'InitialSwiper',

}
</script>

<style scoped>
@import '~/assets/styles.css';

.initial-wrapper {
    width: 70%;
    padding: 20px 0;
    margin: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    display: grid;
    margin: 20px auto;
}

.description {
    margin: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
}

</style>