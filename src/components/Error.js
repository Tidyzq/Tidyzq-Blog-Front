import Message from 'element-ui/packages/message'

export default function onError (err) {
  err = err && err.body ? err.body : err
  Message({
    message: err,
    type: 'error',
  })
}
