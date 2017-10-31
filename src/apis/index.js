import request from './request'
import AuthorizationEvent from '../event-buses/Authorization'

let authInterceptor = null

export function bindAuthorization (getter) {
  if (authInterceptor) {
    request.interceptors.request.reject(authInterceptor)
  }
  authInterceptor = request.interceptors.request.use(config => {
    if (typeof config.headers.Authorization === 'undefined') {
      config.headers.Authorization = getter()
    }
    return config
  })
}

request.interceptors.response.use(null, error => {
  if (error.response.status === 401) {
    AuthorizationEvent.$emit('failed')
  }
  return Promise.reject(error)
})

// solve total count
request.interceptors.response.use(response => {
  const totalCount = response.headers['x-total-count']
  if (typeof totalCount === 'string') {
    response.totalCount = parseInt(totalCount)
  }
  return response
})

export const Auth = {
  login: body => request.post('/api/auth/login', body),
  checkLogin: () => request.get('/api/auth/check-login'),
}

export const User = {
  getAll: () => request.get('/api/users'),
  getById: id => request.get(`/api/users/${id}`),
  changePassword: (id, body) => request.put(`/api/users/${id}/password`, body),
  Post: {
    getAll: id => request.get(`/api/users/${id}/posts`),
  },
}

export const Document = {
  getAll: () => request.get('/api/documents'),
  create: body => request.post('/api/documents', body),
  getById: id => request.get(`/api/documents/${id}`),
  update: (id, body) => request.put(`/api/documents/${id}`, body),
  delete: id => request.delete(`/api/documents/${id}`),
  Tag: {
    getAll: documentId => request.get(`/api/documents/${documentId}/tags`),
    link: (documentId, body) => request.post(`/api/documents/${documentId}/tags`, body),
    update: (documentId, body) => request.put(`/api/documents/${documentId}/tags`, body),
    delete: (documentId, tagId) => request.delete(`/api/documents/${documentId}/tags/${tagId}`),
  },
}

export const Tag = {
  getAll: () => request.get('/api/tags'),
  create: body => request.post('/api/tags', body),
  getById: id => request.get(`/api/tags/id/${id}`),
  updateById: (id, body) => request.put(`/api/tags/id/${id}`, body),
  deleteById: id => request.delete(`/api/tags/id/${id}`),
  getByUrl: id => request.get(`/api/tags/url/${id}`),
  Document: {
    getAll: id => request.get(`/api/tags/id/${id}/documents`),
  },
  Post: {
    getAll: url => request.get(`/api/tags/url/${url}/documents`),
  },
}

export const Post = {
  getAll: ({ limit, offset }) => request.get('/api/posts', { params: { limit, offset } }),
  getByUrl: url => request.get(`/api/posts/${url}`),
  Tag: {
    getAll: url => request.get(`/api/posts/${url}/tags`),
  },
}

export const Page = {
  getByUrl: url => request.get(`/api/pages/${url}`),
}

export const Setting = {
  get: () => request.get('/api/settings'),
  update: body => request.put('/api/settings', body),
}

export { default as Cos } from './cos'
