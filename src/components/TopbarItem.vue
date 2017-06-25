<script>
import getTransport from '@/utils/transport'

const transport = getTransport('topbar')

export default {
  props: {
    to: String,
  },
  created () {
    this.transport()
  },
  mounted () {
    this.transport()
  },
  updated () {
    this.transport()
  },
  beforeDestroy () {
    this.dismiss()
  },
  methods: {
    transport () {
      transport.open({
        to: this.to,
        passengers: [ ...this.$slots.default ],
      })
    },
    dismiss () {
      transport.close({
        to: this.to,
      })
    },
  },
  render (h) {
    return h('div', {
      class: 'topbar-item',
      style: {
        display: 'none',
      },
    })
  },
}
</script>

<style scoped>

</style>
