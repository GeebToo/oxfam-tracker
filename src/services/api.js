import bus from 'components/bus-event'

class Response {
  constructor (b, h) {
    this.body = b
    this.headers = h
  }
}

const host = 'http://localhost:8000/'

let numberOfRequestsInProgress = 0

function requestDone () {
  numberOfRequestsInProgress--
  if (numberOfRequestsInProgress < 0) {
    numberOfRequestsInProgress = 0
  }
  if (numberOfRequestsInProgress === 0) {
    bus.$emit('ui.progress.stop')
  }
}

function requestInProgress () {
  numberOfRequestsInProgress++
  bus.$emit('ui.progress.start')
}

let apiCall = function (endpoint, verb, params, timeout) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    requestInProgress()

    if (endpoint.startsWith('http') || endpoint.startsWith('https')) {
      xhr.open(verb, endpoint, true)
    } else {
      xhr.open(verb, host + endpoint, true)
    }

    let jwt = ''

    if (localStorage.getItem('token')) {
      jwt = localStorage.getItem('token')
    }

    if (jwt !== '') {
      xhr.setRequestHeader('Authorization', 'Bearer ' + jwt)
    }

    xhr.onload = function () {
      requestDone()
      let b = JSON.parse(xhr.responseText)
      let r = new Response(b, xhr.getAllResponseHeaders())

      if (this.status >= 200 && this.status < 300) {
        resolve(r)
      } else {
        reject(r)
      }
    }

    // progression des transferts depuis le serveur jusqu'au client (téléchargement)
    xhr.onprogress = function (oEvent) {
      if (oEvent.lengthComputable) {
        // let p = oEvent.loaded / oEvent.total
      } else {
        // Impossible de calculer la progression puisque la taille totale est inconnue
      }
    }

    xhr.onerror = function () {
      requestDone()
      let b = JSON.parse(xhr.responseText)
      let r = new Response(b, xhr.getAllResponseHeaders())
      reject(r)
    }

    xhr.send()
  })
}

export default {
  get (uri, params) {
    if (params === 'undefined') {
      params = {}
    }
    let endpoint = uri + this.serialize(params)
    return apiCall(endpoint, 'GET', {})
  },
  post (uri, params) {
    if (params === 'undefined') {
      params = {}
    }
    let endpoint = uri + this.serialize(params)
    return apiCall(endpoint, 'POST', {})
  },
  serialize (o) {
    if (!o) {
      o = {}
    }
    var str = []
    for (var p in o) {
      if (o.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(o[p]))
      }
    }
    return (str.length) ? '?' + str.join('&') : ''
  }
}
