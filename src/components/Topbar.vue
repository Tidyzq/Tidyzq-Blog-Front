<script>
import getTransport from '@/utils/transport'

const transport = getTransport('topbar')

export default {
  data () {
    return {
      transport: transport.transport,
    }
  },
  computed: {
    // transport () {
    //   return transport.transport
    // },
    defaultTransport () {
      return this.transport.topbar || {}
    },
    defaultPassengers () {
      return this.defaultTransport.passengers || []
    },
    buttonsTransport () {
      return this.transport.topbarButtons || {}
    },
    buttonsPassengers () {
      return this.buttonsTransport.passengers || []
    },
  },
  render (h) {
    return h('header', {
      class: 'topbar',
    }, [
      h('div', {
        class: 'topbar-body',
      }, this.defaultPassengers),
      h('div', {
        class: 'topbar-buttons',
      }, this.buttonsPassengers),
    ])
  },
}
</script>

<style scoped>

.topbar {
  height: 4rem;
  width: 100%;
  background: blue;
}

.topbar-body, .topbar-buttons {
  height: 100%;
  display: inline-block;
  vertical-align: top;
}

</style>
