<template>
  <div class="rotating-text text-center">
    <span>{{ currentText }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
        textOptions: [
            'Take control of your education.',
            'Take control of your success.',
            'Take control of your life.'
        ],
        currentIndex: 0,
    };
  },
  computed: {
    currentText() {
      return this.textOptions[this.currentIndex];
    },
  },
  mounted() {
    this.startRotation();
  },
  methods: {
    startRotation() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.textOptions.length;
      }, 3000); // Adjust the interval duration as needed
    },
  },
};
</script>


<style>
.rotating-text {
  margin: auto;
  font-size: 28px !important;
}

.rotating-text span {
  animation: rotateText 3s linear infinite;
}

@keyframes rotateText {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
