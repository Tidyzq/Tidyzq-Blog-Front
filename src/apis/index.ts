import request from './request'
import AuthorizationEvent from '../event-buses/Authorization'

// add attribute to axios response
declare module 'axios' {
  // tslint:disable:interface-name
  interface AxiosResponse<T = any> {
    totalCount?: number
  }
}

let authInterceptor: number | null = null

export function bindAuthorization (getter: () => string) {
  if (authInterceptor !== null) {
    request.interceptors.request.eject(authInterceptor)
  }
  authInterceptor = request.interceptors.request.use(config => {
    if (typeof config.headers.Authorization === 'undefined') {
      config.headers.Authorization = getter()
    }
    return config
  })
}

request.interceptors.response.use(undefined, error => {
  if (error.response.status === 401) {
    AuthorizationEvent.$emit('failed')
  }
  return Promise.reject(error)
})

// solve total count
request.interceptors.response.use(response => {
  const totalCount = response.headers['x-total-count']
  if (typeof totalCount === 'string') {
    response.totalCount = parseInt(totalCount, 10)
  }
  return response
})

export class Auth {
  public static login (body: any) {
    return request.post('/api/auth/login', body)
  }
  public static checkLogin () {
    return request.get('/api/auth/check-login')
  }
}

export const User = {
  getAll: () => request.get('/api/users'),
  getById: (id: number) => request.get(`/api/users/${id}`),
  changePassword: (id: number, body: any) => request.put(`/api/users/${id}/password`, body),
  Post: {
    getAll: (id: number) => request.get(`/api/users/${id}/posts`),
  },
}

export const Document = {
  getAll: () => request.get('/api/documents'),
  create: (body: any) => request.post('/api/documents', body),
  getById: (id: number) => request.get(`/api/documents/${id}`),
  update: (id: number, body: any) => request.put(`/api/documents/${id}`, body),
  delete: (id: number) => request.delete(`/api/documents/${id}`),
  Tag: {
    getAll: (documentId: number) => request.get(`/api/documents/${documentId}/tags`),
    link: (documentId: number, body: any) => request.post(`/api/documents/${documentId}/tags`, body),
    update: (documentId: number, body: any) => request.put(`/api/documents/${documentId}/tags`, body),
    delete: (documentId: number, tagId: number) => request.delete(`/api/documents/${documentId}/tags/${tagId}`),
  },
}

export const Tag = {
  getAll: () => request.get('/api/tags'),
  create: (body: any) => request.post('/api/tags', body),
  getById: (id: number) => request.get(`/api/tags/id/${id}`),
  updateById: (id: number, body: any) => request.put(`/api/tags/id/${id}`, body),
  deleteById: (id: number) => request.delete(`/api/tags/id/${id}`),
  getByUrl: (id: number) => request.get(`/api/tags/url/${id}`),
  Document: {
    getAll: (id: number) => request.get(`/api/tags/id/${id}/documents`),
  },
  Post: {
    getAll: (url: string) => request.get(`/api/tags/url/${url}/documents`),
  },
}

export const Post = {
  getAll: ({ limit, offset, sort }: { limit: number, offset: number, sort: any }) => {
    const params: any = { limit, offset }
    for (const key of Object.keys(sort)) {
      params[`sort[${key}]`] = sort[key]
    }
    return request.get('/api/posts', { params })
  },
  getByUrl: (url: string) => request.get(`/api/posts/${url}`),
  Tag: {
    getAll: (url: string) => request.get(`/api/posts/${url}/tags`),
  },
}

export const Page = {
  getByUrl: (url: string) => request.get(`/api/pages/${url}`),
}

export const Setting = {
  get: () => request.get('/api/settings'),
  update: (body: any) => request.put('/api/settings', body),
}

export { default as Cos } from './cos'
