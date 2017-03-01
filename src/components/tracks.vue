<template>
  <div class="wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane name="logo" :disabled="true">
        <span slot="label"><img src="../assets/logo-156x60px.png" style="height:20px;"> pendant l'OXFAM</span>
      </el-tab-pane>
      <el-tab-pane name="first">
        <span slot="label"><i class="fa fa-map-marker"></i> Carte</span>
        <div class="dashboard">
          <section class="dashboard-stats">
            <div class="inner">
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
  components: {
    Chart
  },
  data () {
    return {
      activeName: 'first',
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
  body, html {
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    position: fixed;
  }

  .el-tabs__header {
    background-color: #323a3d;
  }
  .el-tabs__item, .el-tabs__item:hover {
    color: #fdfdfd;
    height: 55px;
    line-height: 55px;
  }

  .el-tabs__item.is-active {
    color: #99cc00;
  }
  .el-tabs__item.is-disabled {
    color: #99cc00;
  }
  .el-tabs__active-bar {
    background-color: #99cc00;
  }

  .dashboard, .chart {
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .dashboard > section, .chart > section {
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    -o-align-items: center;
    align-items: center;
    -ms-flex-align: center;
  }
  @media (max-width: 767px) {
    .dashboard > section {
      min-height: 50px;
    }
    .inner {
      width: 100%;
      padding: 10px;
    }
  }

  .dashboard-map, .chart-container {
    position: relative;
    height: 100%;
  }
  @media (min-width: 768px) {
    .dashboard-stats {
      position: absolute;
      top: 30px;
      right: 30px;
      box-shadow: 0 0 40px rgba(50, 60, 60, 0.4);
      max-width: 450px;
      z-index: 500;
    }
    .inner {
      padding: 40px;
    }
  }

  .dashboard-stats {
    background-color: #99cc00;
    color: #373a3c;
    font-size: 20px;
  }

  .stats-highlight {
    list-style: none;
    padding: 0;
  }

  @media (max-width: 767px) {
    .stats-highlight {
      padding-left: calc(30% + 40px);
      margin: 0px;
    }
    .stats-highlight .stat-item:first-child {
      position: absolute;
      left: 20px;
    }
    .stats-highlight .stat-item .stat-icon {
      padding-right: 5px !important;
      font-size: 1.0rem !important;
    }
    .stats-highlight .stat-item .stat-content .stat-result {
      font-size: 1.4rem !important;
    }
    .stats-highlight .stat-item .stat-content .stat-unit {
      font-size: 0.9rem !important;
    }
    .stats-highlight .stat-item .stat-content .stat-legend {
      font-size: 0.7rem !important;
    }
  }

  .stats-highlight .stat-item > * {
    display: table-cell;
    vertical-align: middle;
  }
  .stats-highlight .stat-item {
    display: table;
    text-align: left;
  }

  .stats-highlight .stat-item .stat-icon {
    padding-right: 15px;
    padding-top: 2px;
    font-size: 2.1rem;
  }

  .stats-highlight .stat-item .stat-content .stat-result {
    display: inline-block;
    font-size: 3.2rem;
    line-height: 1;
    color: white;
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .stats-highlight .stat-item .stat-content .stat-unit {
    display: inline-block;
    font-size: 1.8rem;
    color: #323a3d;
    font-weight: 900;
    letter-spacing: -0.05em;
    margin-left: -5px;
  }

  .stats-highlight .stat-item .stat-content .stat-legend {
    display: block;
    font-size: 0.9rem;
    color: #323a3d;
    margin-top: -5px;
    /*white-space: nowrap;*/
  }

  .map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .el-tabs__header {
    margin: 0;
  }

  @media (max-width: 768px) {
    .el-tabs__item.is-disabled {
      display: none;
    }
  }
</style>
