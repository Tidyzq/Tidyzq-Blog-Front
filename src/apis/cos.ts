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
    let realKey: string = key
    let realFile: File = file
    let realProgress: (() => void) | undefined = progress
    if (typeof key !== 'string') {
      realProgress = (file as any)
      realFile = key as any
      realKey = (file || {}).name
    }
    const token = await getAuthorization('put', realKey)
    await request.put(
      `${url}/${realKey}`,
      realFile,
      {
        headers: {
          Authorization: token,
          'Content-Type': realFile.type,
        },
        onUploadProgress: realProgress,
      },
    )
    return `${config.cos.cdnUrl}/${realKey}`
  },
  async delete (key: string) {
    const token = await getAuthorization('delete', key)
    await request.delete(`${url}/${key}`, { headers: { Authorization: token }})
    return `${config.cos.cdnUrl}/${key}`
  },
}
