<template lang='pug'>
.cos-select
  .cos-select__preview_box(@click='showSelectDialog')
    img.cos-select__preview(:src='value')
</template>

<script>
import CosSelectDialog from './CosSelectDialog.js'

export default {
  props: {
    value: String,
    disabled: Boolean,
  },
  methods: {
    async showSelectDialog () {
      const select = await CosSelectDialog()
      if (select) {
        this.$emit('input', select)
      }
    },
  },
}
</script>

<style scoped>

.cos-select {
  width: 100%;
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.cos-select__preview_box {
  height: 20rem;
  min-width: 20rem;
  display: inline-block;
  vertical-align: top;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  outline: 0;
  padding: 3px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  cursor: pointer;
}

.cos-select__preview {
  min-width: 20rem;
  max-width: 100%;
  max-height: 19.5rem;
  vertical-align: top;
}

</style>
