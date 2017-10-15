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
        // const wrapper = () => {
        //   const delay = 250, now = Date.now()
        //   if (!this._throttleScroll || this._throttleScroll + delay <= now) {
        //     this._throttleScroll = now
        //     this._scroll = this.getRealScroll()
        //     setTimeout(() => {
        //       this._throttleScroll = null
        //       if (this._throttledScroll) {
        //         this._throttledScroll = false
        //         wrapper()
        //       }
        //     }, delay)
        //   } else {
        //     this._throttledScroll = true
        //   }
        // }
        // wrapper()
      }
    },
    scrollTo (val) {
      const realScroll = this.getRealScroll()
      if (realScroll !== this._scroll) {
        const delay = 250, preTick = 10
        const difference = val - realScroll
        const callTimes = delay / preTick
        if (this._smoothScroll) {
          clearTimeout(this._smoothScroll)
        }
        const cbs = []
        for (let i = 0; i < callTimes; ++i) {
          (i => {
            cbs.push(() => {
              this._smoothScroll = setTimeout(() => {
                this._scrolling = true
                this.setRealScroll(realScroll + difference * (i + 1) / callTimes)
                cbs[ i + 1 ]()
              }, preTick)
            })
          })(i)
        }
        cbs.push(() => {})
        cbs[0]()
      }
    },
  },
}
