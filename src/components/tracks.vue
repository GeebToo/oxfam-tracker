<template>
  <div id="wrapper">
    <div id="map"></div>
  </div>
</template>

<script>
import map from '../mixins/map'

const Vacheresse = {
  lng: 6.673627,
  lat: 46.324027
}

export default {
  mixins: [map],
  methods: {
  },
  created () {
  },
  mounted () {
    this.setCenterToLngAndLat(Vacheresse.lng, Vacheresse.lat)

    let me = this

    this.loadJSON('./static/OxfamWintertrail2016.js', function (layer) {
      me.mapObject.fitBounds(layer.getBounds())
    })

    // create custom icon
    var firefoxIcon = {
      iconUrl: './static/marker-red.png',
      iconSize: [64, 64],
      iconAnchor: [32, 64]
    }

    this.addMarker(6.85467481, 46.2672327, firefoxIcon)
  }
}
</script>
<style type="text/css">
  #wrapper, #map {
    height: 100%;
    width: 100%;
  }
</style>