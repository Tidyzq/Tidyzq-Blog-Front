import { now, easeInOut } from '../utils/utils'

export default {
  computed: {
    _scroll () {},
  },
  methods: {
    getRealScroll () {},
    setRealScroll () {},
    onScroll () {
      if (this._scrolling) {
        this._scrolling = false
        return
      }
      if (this.getRealScroll() !== this._scroll) {
        const delay = 250
        if (!this._throttleScroll) {
          this._throttleScroll = setTimeout(() => {
            this._throttleScroll = null
            this._scroll = this.getRealScroll()
          }, delay)
        }
      }
    },
    scrollTo (destScroll, duration = 250) {
      const startScroll = this.getRealScroll()
      if (startScroll !== this._scroll) {
        const difference = destScroll - startScroll
        const startTime = now()
        const step = () => {
          const time = now()
          let elapsed = (time - startTime) / duration
          elapsed = elapsed > 1 ? 1 : elapsed

          const scrollValue = startScroll + difference * easeInOut(elapsed)
          this._scrolling = true
          this.setRealScroll(scrollValue)

          if (elapsed < 1) {
            window.requestAnimationFrame(step)
          }
        }
        window.requestAnimationFrame(step)
      }
    },
  },
}
