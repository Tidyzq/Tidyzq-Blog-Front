<script>
import getTransport from '@/utils/transport'
import SideMenuEvent from '@/event-buses/SideMenu'

const transport = getTransport('topbar')

export default {
  data () {
    return {
      transport: transport.transport,
    }
  },
  computed: {
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
      h('button', {
        attrs: {
          type: 'button',
        },
        class: 'topbar-toggle',
        on: {
          click: this.OnToggle,
        },
      }, [
        h('i', {
          class: 'fa fa-2x fa-bars',
        }),
      ]),
      h('div', {
        class: 'topbar-body',
      }, this.defaultPassengers),
      h('div', {
        class: 'topbar-buttons',
      }, this.buttonsPassengers),
    ])
  },
  methods: {
    OnToggle (e) {
      SideMenuEvent.$emit('toggle')
      e.stopPropagation()
    },
  },
}
</script>

<style scoped>

.topbar {
  height: 4rem;
  width: 100%;
  background: blue;
}

.topbar-toggle {
  display: none;
}

@media only screen and (max-width: 767px) {
  .topbar-toggle {
    display: initial;
  }
}

.topbar-body, .topbar-buttons {
  height: 100%;
  display: inline-block;
  vertical-align: top;
}

</style>
