<template>
  <div>
    <div class="chart">
      <section class="chart-container">
        <div id="container"></div>
      </section>
    </div>
  </div>
</template>

<script>
/* global Highcharts */
export default {
  data () {
    return {
      elevations: {},
      elevationChart: null,
      interval: null
    }
  },
  methods: {
    updateChart () {
      this.$http.get('elevations').then(function (resp) {
        this.elevations = resp.data.elevation
        this.elevationChart.series[0].setData(this.elevations)
      }, function (resp) {
        console.error('Error while trying to get elevations')
      })
    }
  },
  mounted () {
    this.elevationChart = new Highcharts.Chart({
      chart: {
        renderTo: 'container',
        zoomType: 'x',
        marginLeft: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        defaultSeriesType: 'areaspline'
      },
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      xAxis: {
        type: 'linear',
        gridLineWidth: 1,
        title: {
          text: 'Distance en km'
        },
        labels: {
          formatter: function () {
            return Highcharts.numberFormat(this.value / 1000, 0)
          }
        }
      },
      yAxis: {
        min: 0.00,
        title: {
          text: null
        },
        labels: {
          style: {
            'font-size': '9px'
          }
        }
      },
      tooltip: {
        shadow: false,
        shared: true,
        crosshairs: true,
        formatter: function () {
          return this.points[0].y + 'm @ ' + Highcharts.numberFormat(this.x / 1000, 2) + ' km'
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          shadow: false,
          lineColor: '#CCC',
          lineWidth: 1,
          marker: {
            enabled: false,
            radius: 2,
            fillColor: '#323a3d',
            states: {
              hover: {
                enabled: true
              }
            }
          },
          states: {
            hover: {
              enabled: true,
              lineWidth: 1
            }
          }
        }
      },
      series: [{
        color: '#1ab6c8',
        opacity: 0.75,
        data: []
      }]
    })
    this.updateChart()
    let self = this
    this.interval = setInterval(function () {
      self.updateChart()
    }, 20000)
  },
  beforeDestroy: function () {
    clearInterval(this.intervalChart)
  }
}
</script>
<style type="text/css">
  #container {
    width: 100%;
    height: 80%;
  }
</style>
