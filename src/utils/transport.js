import Vue from 'vue'

const transports = {}

class Transport {
  constructor (transport = {}) {
    this.transport = transport
  }

  open (transport) {
    const { to } = transport
    Vue.set(this.transport, to, transport)
  }

  close (transport) {
    const { to } = transport
    Vue.delete(this.transport, to)
  }
}

export default function (name) {
  if (!transports[name]) {
    transports[name] = new Transport()
  }
  return transports[name]
}
