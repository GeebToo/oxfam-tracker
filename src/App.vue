<template>
  <div id="app">
    <tracks></tracks>
    <bottom-menu></bottom-menu>
  </div>
</template>

<script>
import Tracks from './components/tracks'
import BottomMenu from './components/menu'

export default {
  name: 'app',
  components: {
    Tracks,
    BottomMenu
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
