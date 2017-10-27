import Axios from 'axios'
import config from '../config'
import { xml2js } from '../utils/xml'

export const Token = {
  get: (method, key) => Axios.get('/api/cos/token', { params: { method, key } }),
}

async function getAuthorization (method, key) {
  method = (method || 'get').toLowerCase()
  key = key || ''
  const { data: { token } } = await Token.get(method, key)
  return token
}

const url = config.cos.apiUrl

export default {
  Token,
  async get () {
    const token = await getAuthorization('get', '')
    const { data } = await Axios.get(url, { headers: { Authorization: token } })
    const { ListBucketResult: result } = await xml2js(data)
    return result
  },
  async put (key, file, progress) {
    if (arguments.length < 3) {
      progress = file
      file = key
      key = (file || {}).name
    }
    const token = await getAuthorization('put', key)
    await Axios.put(`${url}/${key}`, file, { headers: { Authorization: token, 'Content-Type': file.type }, onUploadProgress: progress })
    return `${config.cos.cdnUrl}/${key}`
  },
  async delete (key) {
    const token = await getAuthorization('delete', key)
    await Axios.delete(`${url}/${key}`, { headers: { Authorization: token }})
    return `${config.cos.cdnUrl}/${key}`
  },
}
