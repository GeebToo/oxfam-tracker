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

const PC = [
  {'lng': 6.792406, 'lat': 46.218621},
  {'lng': 6.754709, 'lat': 46.245966},
  {'lng': 6.718994, 'lat': 46.279446},
  {'lng': 6.787994, 'lat': 46.294959},
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
      stats: {},
      interval: null,
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
        me.layer = layer
        if (center) {
          me.mapObject.fitBounds(layer.getBounds())
        }

        if (locations) {
          let lastlocation = locations.length - 1
          me.teamMarker = me.addMarker(locations[lastlocation][0], locations[lastlocation][1], TEAM_ICON)
          me.teamMarker.bindPopup('<b>Équipes</b>')
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
