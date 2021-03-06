<script>
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
  'color': '#CA3F45',
  'weight': 4,
  'opacity': 1
}

export default {
  created () {
    this.ign = {
      osm: L.tileLayer(this.layerUrl('0jhmxgdy5xmyy32sr4o1c2th', 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD'),
        {attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>'})
    }
    this.openStreetMap = {
      osm: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'})

    }
  },
  methods: {
    // return the geojson default style
    getGeojsonStyle () {
      return GEOJSON_STYLE
    },
    layerUrl (key, layer) {
      return 'https://wxs.ign.fr/' + key +
              '/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&' +
              'LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=PM&' +
              'TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg'
    },
    // set cneter of the map to specified lng, lat and zoom
    setCenterToLngAndLat (lng, lat, zoom) {
      this.mapObject.setView(new L.LatLng(lat, lng), zoom)
    },
    addMarker (lng, lat, icon) {
      let options = {}
      if (icon) {
        options = {icon: L.icon(icon)}
      }
      let m = L.marker([lat, lng], options)
      m.addTo(this.mapObject)
      return m
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
    loadJSON: function (url, cbk) {
      // Process Payload to create a Leaflet geojson layer
      // Add layer to the map and exectute callback if needed
      let processBody = function (body) {
        let layer = L.geoJson(body, {style: GEOJSON_STYLE})
        layer.addTo(this.mapObject)
        // callback
        if (cbk) {
          cbk(layer, body.coordinates)
        }
      }.bind(this)

      // retrieving geojson and add it to cache
      this.$http.get(url).then(function (resp) {
        processBody(resp.body)
      }, function (resp) {
        console.error('Error while trying to download : %d', url)
      })
    }
  },
  mounted () {
    let me = this
    this.mapObject = L.map('map', {
      center: [50.505, 3.36],
      layers: [this.ign.osm],
      zoom: 13
    })
    L.control.layers({'IGN Topo Express': this.ign.osm, 'OpenStreetMap': this.openStreetMap.osm}, {}, {position: 'topleft'}).addTo(this.mapObject)
    bus.$on('map.center', function (lng, lat) {
      me.setCenterToLngAndLat(lng, lat)
    })
  }
}
</script>
