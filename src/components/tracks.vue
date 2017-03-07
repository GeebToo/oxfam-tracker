<template>
  <div class="wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane name="logo" :disabled="true">
        <span slot="label">Suivez <img src="../assets/logo-156x60px.png" style="height:20px;"> durant l'OXFAM</span>
      </el-tab-pane>
      <el-tab-pane name="first">
        <span slot="label"><i class="fa fa-map-marker"></i> Carte</span>
        <div class="dashboard">
          <section class="dashboard-stats">
            <div class="inner">
              <header>
                <h1>Récapitulatif : </h1>
              </header>
              <ul class="stats-highlight">
                <li class="stat-item">
                  <div class="stat-icon">
                    <i class="fa fa-map-marker"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-result">{{ stats.distance | toKm }}</span>
                    <span class="stat-unit">km</span>
                    <span class="stat-legend">parcourus en</span>
                  </div>
                </li>
                <li class="stat-item">
                  <div class="stat-icon">
                    <i class="fa fa-clock-o"></i>
                  </div>
                  <div class="stat-content">
                    <span class="stat-result">{{ stats.time | toHHMM }}</span>
                    <span class="stat-unit">min</span>
                    <span class="stat-legend">dernière mise à jour : {{ stats.updateAt | formatDate}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section class="dashboard-map">
            <div id="map" class="map"></div>
          </section>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Config" name="second">
        <span slot="label"><i class="fa fa-area-chart"></i> Dénivelé</span>
        <chart></chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import map from '../mixins/map'
import Chart from './chart'

const PC = [
  {'lng': 6.792406, 'lat': 46.218621},
  {'lng': 6.754709, 'lat': 46.245966},
  {'lng': 6.716597, 'lat': 46.279269},
  {'lng': 6.788079, 'lat': 46.295589},
  {'lng': 6.821114, 'lat': 46.254709},
  {'lng': 6.853990, 'lat': 46.237835},
  {'lng': 6.820422, 'lat': 46.254543},
  {'lng': 6.798970, 'lat': 46.291389},
  {'lng': 6.719972, 'lat': 46.279917}
]

const TEAM_ICON = {
  iconUrl: './static/pin-green.png',
  iconSize: [40, 48],
  iconAnchor: [20, 48],
  popupAnchor: [1, -48]
}

export default {
  mixins: [map],
  components: {
    Chart
  },
  data () {
    return {
      activeName: 'first',
      stats: {
        distance: 0,
        time: 0,
        updateAt: '0001-01-01T00:00:00Z'
      },
      interval: null,
      teamMarker: null,
      layer: null
    }
  },
  methods: {
    updateMap (center) {
      this.$http.get('./static/stats.json').then(function (resp) {
        this.stats = resp.data
      }, function (resp) {
        console.error('Error while trying to get stats')
      })

      let me = this
      this.loadJSON('./static/locations.json', function (layer, locations) {
        if (me.layer) {
          me.layer.clearLayers()
        }
        if (me.teamMarker) {
          me.mapObject.removeLayer(me.teamMarker)
        }
        me.layer = layer
        if (center) {
          me.mapObject.fitBounds(layer.getBounds())
        }

        if (locations) {
          let lastlocation = locations.length - 1
          me.teamMarker = me.addMarker(locations[lastlocation][0], locations[lastlocation][1], TEAM_ICON)
          me.teamMarker.bindPopup('<b>XeeTrooper</b>')
        }
      })
    },
    AddRunMarker () {
      PC.forEach((pc, index) => {
        let pinName = 'pin-pc' + index + '.png'
        let pinLegend = '<b>Point de contrôle ' + index + '</b>'
        if (index === 0) {
          pinName = 'pin-start.png'
          pinLegend = '<b>Départ</b>'
        } else if (index === PC.length - 1) {
          pinName = 'pin-end.png'
          pinLegend = '<b>Arrivée</b>'
        }
        let mpc = this.addMarker(pc.lng, pc.lat, {
          iconUrl: './static/' + pinName,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
          popupAnchor: [1, -48]
        })
        mpc.bindPopup(pinLegend)
      })
    }
  },
  created () {
  },
  mounted () {
    this.setCenterToLngAndLat(PC[0].lng, PC[0].lat)
    this.AddRunMarker()
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

<style src="./style.css">
</style>
