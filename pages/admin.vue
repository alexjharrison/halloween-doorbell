<template>
  <div class="h-100">
    <div v-if="!hasInteracted" class="d-flex justify-content-center mt-5">
      <b-button
        variant="light"
        size="lg"
        class="align-self-center"
        @click="hasInteracted = true"
      >
        Click Me
      </b-button>
    </div>
    <div v-else-if="!isSomeoneThere" class="m-4 text-center">
      <h1>Children Tracker</h1>
      <label>Volume Threshold</label>
      <b-input v-model.number="timeout" type="number" class="w-auto m-auto" />
    </div>
    <div
      v-else
      class="children-here h-100 d-flex justify-content-center align-items-center"
    >
      <div>
        <h1>!!!</h1>
        <h1 class="children-here-text">Childrens are Here</h1>
        <h1>!!!</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      honkAudio: null,
      hasInteracted: false,
    }
  },
  computed: {
    timeout: {
      get() {
        return this.$store.state.volumeThreshold
      },
      set(val) {
        this.$store.commit('setVolumeThreshold', val)
      },
    },
    isSomeoneThere() {
      return this.$store.state.isSomeoneThere
    },
  },
  watch: {
    isSomeoneThere(val) {
      if (val) this.honkAudio.play()
      else this.honkAudio.pause()
    },
  },
  mounted() {
    this.honkAudio = new Audio('https://doorbell.aharrison.xyz/honk.wav')
    this.honkAudio.loop = true
    this.startInterval()
  },
  methods: {
    startInterval() {
      setInterval(() => {
        this.$axios
          .$get('https://doorbell.aharrison.xyz/api')
          .then(res => this.$store.commit('updateStore', res))
      }, 2000)
    },
  },
}
</script>

<style scoped>
.children-here {
  animation: flash-bg-colors 5s infinite;
}
.children-here h1 {
  font-size: 150px;
  text-align: center;
}

.flash-bg-colors {
}

@keyframes flash-bg-colors {
  0% {
    background-color: #000;
    color: #fff;
  }
  15% {
    background-color: #fc4605;
    color: #000;
  }
  30% {
    background-color: #ea0c0c;
    color: #fff;
  }
  45% {
    background-color: #fff;
    color: #000;
  }
  60% {
    background-color: #940194;
    color: #fff;
  }
  75% {
    background-color: #3fab43;
    color: #000;
  }
}
</style>
