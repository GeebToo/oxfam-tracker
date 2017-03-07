// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueResource from 'vue-resource'
import moment from 'moment'

import App from './App'

Vue.use(Element)
Vue.use(VueResource)

Vue.filter('toKm', function (value) {
  value = value / 1000
  return Math.round(value * 100) / 100
})

Vue.filter('toHHMM', function (value) {
  let h = Math.trunc(value / 3600)
  let m = Math.trunc((value % 3600) / 60)
  if (h === 0) {
    return m
  } else if (m === 0) {
    return h + ' h 00'
  } else {
    return h + ' h ' + m
  }
})

Vue.filter('formatDate', function (value) {
  if (value === '0001-01-01T00:00:00Z') {
    return '-'
  } else if (value) {
    return moment(String(value)).format('DD/MM HH:mm')
  }
})

// Vue.http.options.root = 'https://oxfam.xee.com/teams/1'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
