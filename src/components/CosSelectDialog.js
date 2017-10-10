import Vue from 'vue'
import CosSelectDialogComponent from './CosSelectDialog.vue'

const CosSelectDialogConstructor = Vue.extend(CosSelectDialogComponent)
let instance

export default function CosSelectDialog () {

  if (!instance) {
    instance = new CosSelectDialogConstructor()
    instance.$mount()
    document.body.appendChild(instance.$el)
  }

  return new Promise(resolve => {
    instance.$once('select', resolve)
    instance.$emit('open')
  })
}
