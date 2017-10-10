import Vue from 'vue'
import ConfirmComponent from './Confirm.vue'

const ConfirmConstructor = Vue.extend(ConfirmComponent)
let instance

export default function Confirm (title, message) {
  let vm

  if (instance) {
    vm = instance.vm
    vm.title = title
    vm.message = message
  } else {
    instance = new ConfirmConstructor({
      propsData: {
        title,
        message,
      },
    })
    vm = instance.vm = instance.$mount()
    document.body.appendChild(vm.$el)
  }

  return new Promise(resolve => {
    vm.$once('confirm', resolve)
    vm.$emit('open')
  })
}
