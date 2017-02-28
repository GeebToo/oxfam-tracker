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
const TEAM_ICON = {
  iconUrl: './static/marker-blue.png',
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [0, -64]
}
const GREEN_ICON = {
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}

export default {
  mixins: [map],
  data () {
    return {
      stats: {},
      interval: null,
      startMarker: null,
      teamMarker: null,
      layer: null
    }
  },
  methods: {
    updateMap (center) {
      this.$http.get('stats').then(function (resp) {
        this.stats = resp.data
      }, function (resp) {
        console.error('Error while trying to get stats')
      })

      let me = this
      this.loadJSON('locations', function (layer, locations) {
        if (me.layer) {
          me.layer.clearLayers()
        }
        if (me.teamMarker) {
          me.mapObject.removeLayer(me.teamMarker)
        }
        if (me.startMarker) {
          me.mapObject.removeLayer(me.startMarker)
        }
        me.layer = layer
        if (center) {
          me.mapObject.fitBounds(layer.getBounds())
        }
        let lastlocation = locations.length - 1
        me.startMarker = me.addMarker(locations[0][0], locations[0][1], GREEN_ICON)
        me.startMarker.bindPopup('<b>Départ</b>')
        me.teamMarker = me.addMarker(locations[lastlocation][0], locations[lastlocation][1], TEAM_ICON)
        me.teamMarker.bindPopup('<b>Equipe</b>')
      })
    }
  },
  created () {
  },
  mounted () {
    this.setCenterToLngAndLat(Vacheresse.lng, Vacheresse.lat)
    this.updateMap(true)
    let self = this
    this.interval = setInterval(function () {
      self.updateMap(false)
    }, 20000)
  },
  beforeDestroy: function () {
    clearInterval(this.interval)
  }
}
</script>
<style type="text/css">
  #wrapper, #map {
    height: 100%;
    width: 100%;
  }
</style>
