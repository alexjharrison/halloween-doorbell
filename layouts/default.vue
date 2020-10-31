<template>
  <div id="app">
    <Nuxt class="page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
// import socket from '@/mixins/socket'

export default defineComponent({
  // mixins: [socket],
})
</script>

<style>
body {
  font-size: 1.4em;
}
html,
body,
#__layout,
#__nuxt,
#app,
.page {
  background-color: #fc4605;
  height: 100%;
}
</style>
