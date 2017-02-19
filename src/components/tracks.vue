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
    let team = function (url) {
      return {
        iconUrl: url,
        iconSize: [64, 64],
        iconAnchor: [32, 64],
        popupAnchor: [0, -64]
      }
    }

    let team1 = team('./static/marker-red.png')
    let team2 = team('./static/marker-green.png')
    let team3 = team('./static/marker-blue.png')

    let m1 = this.addMarker(6.82379722, 46.2545263, team1)
    m1.bindPopup('<b>Equipe 1</b>')

    let m2 = this.addMarker(6.80560111, 46.2832284, team2)
    m2.bindPopup('<b>Equipe 2</b>')

    let m3 = this.addMarker(6.78377866, 46.2892043, team3)
    m3.bindPopup('<b>Equipe 3</b>')
  }
}
</script>
<style type="text/css">
  #wrapper, #map {
    height: 100%;
    width: 100%;
  }
</style>