<template>
  <main>
    <div v-if="!hasInteracted" class="d-flex justify-content-center mt-5">
      <b-button size="lg" variant="light" @click="hasInteracted = true"
        >Click Me to Start</b-button
      >
    </div>
    <div v-else-if="!selectedDeviceId">
      <h1 class="m-3">Pick a microphone to listen to</h1>
      <ul class="list-unstyled">
        <li v-for="(device, i) in devices" :key="i">
          <b-button
            variant="light"
            class="ml-4 mt-3"
            size="sm"
            @click="startRecording(device.deviceId)"
          >
            {{ device.label }}
          </b-button>
        </li>
      </ul>
    </div>
    <candy-time v-else-if="$store.state.isSomeoneThere" />
    <yell v-else />
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Yell from '@/components/Yell.vue'
import CandyTime from '@/components/CandyTime.vue'
import { Store } from '~/store'

interface Datum {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  dataArray: number[]
  hasInteracted: boolean
  noSleep: any
}

export default defineComponent({
  components: { Yell, CandyTime },
  data() {
    const data: Datum = {
      devices: [],
      selectedDeviceId: '',
      dataArray: [],
      hasInteracted: false,
      noSleep: null,
    }
    return data
  },
  computed: {
    maxVolume() {
      if (this.dataArray.length === 0) return ''
      const data: number[] = [...this.dataArray]
      return Math.max(...data.map(val => Math.abs(val - 128)))
    },
    volumeThreshold() {
      return this.$store.state.volumeThreshold
    },
    isSomeoneThere() {
      return this.$store.state.isSomeoneThere
    },
  },
  watch: {
    hasInteracted() {
      // ask user for permission
      try {
        navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (e) {
        window.location.reload()
      }

      // get list of microphones after first interaction
      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.devices = devices
      })

      setInterval(() => {
        this.$axios
          .$get('https://doorbell.aharrison.xyz/api')
          .then((res: Store) => this.$store.commit('updateStore', res))
      }, 2000)
    },
    maxVolume(volume) {
      if (!this.isSomeoneThere && volume > this.volumeThreshold) {
        this.$store.dispatch('dingDong')
      }
    },
    selectedDeviceId() {
      // disable wakelock after mic selection
      const NoSleep = require('nosleep.js')
      this.noSleep = new NoSleep()
      this.noSleep.enable()
    },
  },
  methods: {
    async startRecording(id: string) {
      this.selectedDeviceId = id
      const constraints = {
        audio: true,
        deviceId: this.selectedDeviceId,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyzer = audioCtx.createAnalyser()
      analyzer.fftSize = 2048
      const bufferLength = analyzer.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      source.connect(analyzer)

      setInterval(() => {
        analyzer.getByteTimeDomainData(dataArray)
        this.dataArray = [...dataArray]
      }, 200)
    },
  },
})
</script>
