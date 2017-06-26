<template lang='pug'>
  file-select(@input='onSelectAvatar', accept='image/png,image/jpeg,image/gif')
    img(:src='(value && value.dataUrl) || defaultUrl', width='100')
    el-button(slot='trigger', type='primary') 上传
</template>

<script>
export default {
  props: {
    value: [ Object, File ],
    defaultUrl: String,
  },
  methods: {
    onSelectAvatar ([ avatar ]) {
      if (avatar) {
        const reader = new FileReader()
        reader.onload = ev => {
          avatar.dataUrl = ev.target.result
          this.$emit('input', avatar)
        }
        reader.readAsDataURL(avatar)
      } else {
        this.$emit('input', null)
      }
    },
  },
}
</script>
