<template lang='pug'>
  file-select(@input='onSelectImage', accept='image/png,image/jpeg,image/gif')
    img(:src='(_value && _value.dataUrl) || defaultUrl', width='100')
    el-button(slot='trigger', type='primary') 上传
</template>

<script>
export default {
  props: {
    value: [ Object, File ],

    defaultUrl: String,
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    onSelectImage ([ image ]) {
      if (image) {
        const reader = new FileReader()
        reader.onload = ev => {
          image.dataUrl = ev.target.result
          this._value = image
        }
        reader.readAsDataURL(image)
      } else {
        this._value = null
      }
    },
  },
}
</script>
