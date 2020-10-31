<template>
  <main>
    <div v-if="!selectedDeviceId">
      <ul>
        <li
          v-for="(device, i) in devices"
          :key="i"
          @click="startRecording(device.deviceId)"
        >
          {{ device.label }}
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

interface Datum {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  dataArray: number[]
  noSleep: any
}

export default defineComponent({
  components: { Yell, CandyTime },
  data() {
    const data: Datum = {
      devices: [],
      selectedDeviceId: '',
      dataArray: [],
      noSleep: null,
    }
    return data
  },
  mounted() {
    // ask for microphone to use
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.devices = devices
    })
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
    maxVolume(volume) {
      if (!this.isSomeoneThere && volume > this.volumeThreshold) {
        this.$store.dispatch('dingDong')
      }
    },
    selectedDevice() {
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
