<template>
  <div class="loading-indicator">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
@import '~/assets/styles.css';

.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>