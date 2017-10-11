<template lang='pug'>
.avatar-select
  .avatar-select__preview_box(@click='showSelectDialog')
    img.avatar-select__preview(:src='value')
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

.avatar-select {
  width: 100%;
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.avatar-select__preview_box {
  height: 10rem;
  min-width: 10rem;
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

.avatar-select__preview {
  min-width: 10rem;
  max-height: 9.5rem;
  vertical-align: top;
}

</style>
