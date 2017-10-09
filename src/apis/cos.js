import Vue from 'vue'
import config from '@/config'
import xml from '@/utils/xml'

const Token = Vue.resource('/api/cos/token')

function getAuthorization (method, key) {
  method = (method || 'get').toLowerCase()
  key = key || ''
  return Token.get({ method, key })
    .then(({ body: { token } }) => token)
}

const url = config.cos.apiUrl

function listBucket () {
  return getAuthorization()
    .then(token => Vue.http.get(url, { headers: { Authorization: token } }))
    .then(({ body }) => xml(body))
    .then(({ ListBucketResult }) => ListBucketResult)
}

function putObject (key, file) {
  if (arguments.length < 2) {
    file = key
    key = (file || {}).name
  }
  return getAuthorization('put', key)
    .then(token => Vue.http.put(`${url}/${key}`, file, { headers: { Authorization: token, 'Content-Type': file.type } }))
    .then(() => `${config.cos.cdnUrl}/${key}`)
}

function deleteObject (key) {
  return getAuthorization('delete', key)
    .then(token => Vue.http.delete(`${url}/${key}`, { headers: { Authorization: token } }))
    // .then(({ body }) => xml(body))
    .then(console.log)
}

export default {
  Token,
  get: listBucket,
  put: putObject,
  delete: deleteObject,
}
