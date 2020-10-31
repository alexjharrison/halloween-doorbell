<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <h1>Candy is Coming</h1>
    <b-img src="~assets/candy.png" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      waterphone: null,
    }
  },
  mounted() {
    this.waterphone = new Audio('waterphone.mp3')
    this.waterphone.play()
  },
  beforeDestroy() {
    this.waterphone.pause()
  },
}
</script>

<style scoped>
h1 {
  font-size: 5em;
  transform: rotate(-20deg);
  margin: 100px 400px 0 0;
}

img {
  height: 500px;
  animation: spin 8s infinite;
}

@keyframes spin {
  /* 0% {
    transform: ;
  } */
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
