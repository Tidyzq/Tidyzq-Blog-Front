import Vue from 'vue'
import CosSelectDialogComponent from './CosSelectDialog.vue'

const CosSelectDialogConstructor = Vue.extend(CosSelectDialogComponent)
let instance

export default function CosSelectDialog () {
  let vm

  if (instance) {
    vm = instance.vm
  } else {
    instance = new CosSelectDialogConstructor()
    vm = instance.vm = instance.$mount()
    document.body.appendChild(vm.$el)
  }

  return new Promise(resolve => {
    vm.$once('select', resolve)
    vm.$emit('open')
  })
}
