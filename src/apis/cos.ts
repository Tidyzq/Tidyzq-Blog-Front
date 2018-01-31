import request from './request'
import config from '../config'
import { xml2js } from '../utils/xml'

export const Token = {
  get: (method: string, key: string) => request.get('/api/cos/token', { params: { method, key } }),
}

async function getAuthorization (method: string, key: string) {
  const realMethod = (method || 'get').toLowerCase()
  const realKey = key || ''
  const { data: { token } } = await Token.get(realMethod, realKey)
  return token
}

const url = config.cos.apiUrl

export default {
  Token,
  async get () {
    const token = await getAuthorization('get', '')
    const { data } = await request.get(url, { headers: { Authorization: token } })
    const { ListBucketResult: result } = await xml2js(data)
    return result
  },
  async put (key: string, file: File, progress?: () => void) {
    if (typeof key !== 'string') {
      progress = (file as any)
      file = key as any
      key = (file || {}).name
    }
    const token = await getAuthorization('put', key)
    await request.put(
      `${url}/${key}`,
      file,
      {
        headers: {
          Authorization: token,
          'Content-Type': file.type,
        },
        onUploadProgress: progress,
      },
    )
    return `${config.cos.cdnUrl}/${key}`
  },
  async delete (key: string) {
    const token = await getAuthorization('delete', key)
    await request.delete(`${url}/${key}`, { headers: { Authorization: token }})
    return `${config.cos.cdnUrl}/${key}`
  },
}
