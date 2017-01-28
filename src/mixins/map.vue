<script>
import api from '../services/api'
import bus from '../components/bus-event'
import L from 'leaflet/dist/leaflet-src.js'
import 'leaflet-easybutton/src/easy-button.js'
import 'leaflet-easybutton/src/easy-button.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const GEOJSON_STYLE = {
  'color': '#ff0000',
  'weight': 3,
  'opacity': 0.55
}

export default {

  beforeCreate () {
    this.layers = {
      osm: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'})
    }
  },
  methods: {
    // return the geojson default style
    getGeojsonStyle () {
      return GEOJSON_STYLE
    },
    // set cneter of the map to specified lng, lat and zoom
    setCenterToLngAndLat (lng, lat, zoom) {
      this.mapObject.setView(new L.LatLng(lat, lng), zoom)
    },
    // add button to the map
    addButton (icon, fn) {
      L.easyButton(icon, fn).addTo(this.mapObject)
    },
    // add cluster marker
    addClusterMarker () {
      this.clusterMarkers = L.markerClusterGroup()
      this.mapObject.addLayer(this.clusterMarkers)
    },
    resetClusterMarker () {
      this.clusterMarkers.clearLayers()
    },
    addMarkerWithLngAndLatToCluster (lng, lat) {
      let marker = L.marker(new L.LatLng(lat, lng))
      this.clusterMarkers.addLayer(marker)
      return marker
    },
    // load geojson to the map with cache management
    loadJSON: function (id, factor, cbk) {
      // Simplification factor
      if (!factor) {
        factor = 0
      }

      // Process Payload to create a Leaflet geojson layer
      // Add layer to the map and exectute callback if needed
      let processBody = function (body) {
        let layer = L.geoJson(body, {style: GEOJSON_STYLE})
        layer.addTo(this.mapObject)
        layer.refId = id
        if (cbk) {
          cbk(layer)
        }
      }.bind(this)

      // retrieving geojson and add it to cache
      api.get('/tracks/' + id + '/geojson?factor=' + factor).then((response) => {
        processBody(response.body)
      }, (response) => {
        console.error('Error while trying to download : %d', id)
      })
    }
  },
  mounted () {
    let me = this
    this.mapObject = L.map('map', {
      center: [50.505, 3.36],
      layers: [this.layers.osm],
      zoom: 13
    })
    bus.$on('map.center', function (lng, lat) {
      me.setCenterToLngAndLat(lng, lat)
    })
  }
}
</script>