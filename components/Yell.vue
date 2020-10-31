<template>
  <div
    class="d-flex h-100 flex-column justify-content-between align-items-center"
  >
    <div class="d-flex align-items-center justify-content-around w-100">
      <b-img fluid src="~assets/pumpkin.png" />
      <p class="yell">Yell</p>
      <b-img fluid src="~assets/cat.png" />
    </div>
    <p class="tot">Trick or Treat</p>
    <p class="candy">To Get Candy!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rotate: 10,
      scale: 10,
    }
  },
}
</script>

<style scoped>
p {
  font-size: 5.9em;
}
.yell {
}
.tot {
  font-weight: 800;
  animation: swing 2s infinite ease-in-out;
}
.candy {
}

img {
  height: 200px;
}

@keyframes swing {
  0%,
  100% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg) scale(1.2);
  }
}
</style>
