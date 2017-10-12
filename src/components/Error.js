import ElementUI from 'element-ui'
const Message = ElementUI.Message

export default function onError (err) {
  let message
  if (err instanceof Response || (err && err.body)) { // vue-resource response
    message = err.body
  } else if (err instanceof Error) {
    message = err.message
  } else {
    try {
      message = JSON.stringify(err)
    } catch (e) {
      message = err
    }
  }
  Message({
    message,
    type: 'error',
  })
}
