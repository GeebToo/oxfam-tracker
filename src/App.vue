<template>
  <div id="app">
    <tracks></tracks>
  </div>
</template>

<script>
import Tracks from './components/tracks'

export default {
  name: 'app',
  components: {
    Tracks
  }
}
</script>
<style type="text/css">
  body, html, #app {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0
  }
</style>
