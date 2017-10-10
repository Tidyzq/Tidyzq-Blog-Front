import Vue from 'vue'
import ConfirmComponent from './Confirm.vue'

const ConfirmConstructor = Vue.extend(ConfirmComponent)
let instance

export default function Confirm (title, message) {

  if (instance) {
    instance.title = title
    instance.message = message
  } else {
    instance = new ConfirmConstructor({
      propsData: {
        title,
        message,
      },
    })
    instance.$mount()
    document.body.appendChild(instance.$el)
  }

  return new Promise(resolve => {
    instance.$once('confirm', resolve)
    instance.$emit('open')
  })
}
