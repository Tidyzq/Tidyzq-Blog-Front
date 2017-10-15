<template lang='pug'>
  canvas.grid(ref='canvas')
</template>

<script>
const sqrt3 = Math.sqrt(3), sqrt3_2 = Math.sqrt(3) / 2

export default {
  props: {
    radius: {
      type: Number,
      default: 32,
    },
    offset: {
      type: Number,
      default: 70,
    },
  },
  mounted () {
    this._timeInterval = setInterval(() => {
      this.time += 0.02
    }, 50)
    window.addEventListener('resize', this.onResive)
    const canvas = this.$refs.canvas
    this.context = canvas.getContext('2d')
    this.onResive()
  },
  beforeDestroy () {
    clearInterval(this._timeInterval)
    window.removeEventListener('resize', this.onResive)
  },
  data () {
    return {
      width: 0,
      height: 0,
      hexagons: [],
      time: 0,
    }
  },
  computed: {
    radius_2 () {
      return this.radius / 2
    },
    radius_sqrt3_2 () {
      return this.radius * sqrt3_2
    },
    realOffset () {
      return this.width / (sqrt3_2 * Math.floor(this.width / (this.offset * sqrt3_2)))
    },
    limitX () {
      return Math.floor(this.width / (this.offset * sqrt3)) + 1
    },
    limitY () {
      return Math.ceil(2 * this.height / this.realOffset) + 1
    },
  },
  watch: {
    time () {
      this.render(this.time)
    },
    width () {
      this.$refs.canvas.width = this.width
    },
    height () {
      this.$refs.canvas.height = this.height
    },
    limitX () {
      if (this.limitX > (this.hexagons[0] || []).length) {
        for (const hexagonLine of this.hexagons) {
          if (this.limitX > hexagonLine.length) {
            const toPush = Array(this.limitX - hexagonLine.length).fill(null).map(() =>  12 * Math.PI * Math.random())
            Array.prototype.push.apply(hexagonLine, toPush)
          }
        }
      }
    },
    limitY () {
      if (this.limitY > this.hexagons.length) {
        let toAdd = this.limitY - this.hexagons.length
        while (toAdd--) {
          const toPush = Array(this.limitX).fill(null).map(() => 12 * Math.PI * Math.random())
          Array.prototype.push.call(this.hexagons, toPush)
        }
      }
    },
  },
  methods: {
    onResive () {
      const canvas = this.$refs.canvas
      this.width = canvas.parentElement.clientWidth * 2
      this.height = canvas.parentElement.clientHeight * 2
      this.$nextTick(() => this.render(this.time))
    },
    render (t = 0) {
      const startX = 0, startY = 0

      for (let indexY = 0; indexY < this.limitY; ++indexY) {
        const y = startY + this.realOffset * indexY / 2
        if (y - sqrt3_2 * this.radius >= this.height) { break }
        const lineStartX = indexY & 1 ? startX + sqrt3_2 * this.realOffset : startX
        for (let indexX = 0; indexX < this.limitX; ++indexX) {
          const x = lineStartX + sqrt3 * this.realOffset * indexX
          if (x - this.radius >= this.width) { break }
          this.drawHexagon(x, y, this.getColor(this.hexagons[indexY][indexX] + t))
        }
      }
    },
    getColor (t) {
      const rate = Math.max(0, (Math.sin(t) + Math.sin(t / 2) + Math.sin(t / 3)) / 3)
      const r = Math.floor(rate * (255 - 51)) + 51
      const g = Math.floor(rate * (255 - 102)) + 102
      const b = Math.floor(rate * (255 - 153)) + 153
      return `rgb(${r},${g},${b})`
    },
    drawHexagon (originX, originY, color) {
      this.context.fillStyle = color
      this.context.beginPath()
      this.context.moveTo(originX - this.radius, originY)
      this.context.lineTo(originX - this.radius_2, originY - this.radius_sqrt3_2)
      this.context.lineTo(originX + this.radius_2, originY - this.radius_sqrt3_2)
      this.context.lineTo(originX + this.radius, originY)
      this.context.lineTo(originX + this.radius_2, originY + this.radius_sqrt3_2)
      this.context.lineTo(originX - this.radius_2, originY + this.radius_sqrt3_2)
      this.context.closePath()
      this.context.fill()
    },
  },
}
</script>

<style>
.grid {
  background: #999999;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
