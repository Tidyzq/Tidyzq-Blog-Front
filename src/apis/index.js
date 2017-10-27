import Axios from 'axios'
import AuthorizationEvent from '../event-buses/Authorization'

let authInterceptor = null

export function bindAuthorization (getter) {
  if (authInterceptor) {
    Axios.interceptors.request.reject(authInterceptor)
  }
  authInterceptor = Axios.interceptors.request.use(config => {
    if (typeof config.headers.Authorization === 'undefined') {
      config.headers.Authorization = getter()
    }
    return config
  })
}

Axios.interceptors.response.use(null, error => {
  if (error.response.status === 401) {
    AuthorizationEvent.$emit('failed')
  }
  return Promise.reject(error)
})

// solve total count
Axios.interceptors.response.use(response => {
  const totalCount = response.headers['x-total-count']
  if (typeof totalCount === 'string') {
    response.totalCount = parseInt(totalCount)
  }
  return response
})

export const Auth = {
  login: body => Axios.post('/api/auth/login', body),
  checkLogin: () => Axios.get('/api/auth/check-login'),
}

export const User = {
  getAll: () => Axios.get('/api/users'),
  getById: id => Axios.get(`/api/users/${id}`),
  changePassword: (id, body) => Axios.put(`/api/users/${id}/password`, body),
  Post: {
    getAll: id => Axios.get(`/api/users/${id}/posts`),
  },
}

export const Document = {
  getAll: () => Axios.get('/api/documents'),
  create: body => Axios.post('/api/documents', body),
  getById: id => Axios.get(`/api/documents/${id}`),
  update: (id, body) => Axios.put(`/api/documents/${id}`, body),
  delete: id => Axios.delete(`/api/documents/${id}`),
  Tag: {
    getAll: documentId => Axios.get(`/api/documents/${documentId}/tags`),
    link: (documentId, body) => Axios.post(`/api/documents/${documentId}/tags`, body),
    update: (documentId, body) => Axios.put(`/api/documents/${documentId}/tags`, body),
    delete: (documentId, tagId) => Axios.delete(`/api/documents/${documentId}/tags/${tagId}`),
  },
}

export const Tag = {
  getAll: () => Axios.get('/api/tags'),
  create: body => Axios.post('/api/tags', body),
  getById: id => Axios.get(`/api/tags/id/${id}`),
  updateById: (id, body) => Axios.put(`/api/tags/id/${id}`, body),
  deleteById: id => Axios.delete(`/api/tags/id/${id}`),
  getByUrl: id => Axios.get(`/api/tags/url/${id}`),
  Document: {
    getAll: id => Axios.get(`/api/tags/id/${id}/documents`),
  },
  Post: {
    getAll: url => Axios.get(`/api/tags/url/${url}/documents`),
  },
}

export const Post = {
  getAll: () => Axios.get('/api/posts'),
  getByUrl: url => Axios.get(`/api/posts/${url}`),
  Tag: {
    getAll: url => Axios.get(`/api/posts/${url}/tags`),
  },
}

export const Page = {
  getByUrl: url => Axios.get(`/api/pages/${url}`),
}

export const Setting = {
  get: () => Axios.get('/api/settings'),
  update: body => Axios.put('/api/settings', body),
}

export { default as Cos } from './cos'
