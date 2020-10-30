<template>
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

  <div v-else>
    <h1>Volume: {{ meanVolume }}</h1>
    <p>{{ dataArray }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

interface Datum {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  dataArray: number[]
}

export default defineComponent({
  data() {
    const data: Datum = {
      devices: [],
      selectedDeviceId: '',
      dataArray: [],
    }
    return data
  },
  mounted() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.devices = devices
    })
  },
  computed: {
    meanVolume() {
      if (this.dataArray.length === 0) return ''
      const data: number[] = [...this.dataArray]
      return Math.max(...data.map(val => Math.abs(val - 128)))
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
