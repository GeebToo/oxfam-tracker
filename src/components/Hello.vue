<template>
  <div id="wrapper">
    <div id="map"></div>
  </div>
</template>

<script>
import map from '../mixins/map'
import bus from './bus-event'

export default {
  mixins: [map],
  methods: {
  },
  created () {
    let me = this
    bus.$on('map.loadtrack', function (id) {
      me.loadJSON(id, 0, function (layer) {
        me.mapObject.fitBounds(layer.getBounds())
      })
    })
  },
  mounted () {
    this.setCenterToLngAndLat(6.673627, 46.324027)
  }
}
</script>
<style type="text/css">
  #wrapper, #map {
    height: 300px;
    width: 100%;
  }
</style>