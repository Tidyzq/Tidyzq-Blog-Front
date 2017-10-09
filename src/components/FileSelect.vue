<template lang='pug'>
.file-select
  slot
  .file-select-trigger(@click='OnClick')
    slot(name='trigger')
  input(ref='file', type='file', @change='OnFileChange', :multiple='multiple', :disabled='disabled', :accept='accept')
</template>

<script>
export default {
  props: {
    value: Array,
    multiple: Boolean,
    disabled: Boolean,
    accept: String,
  },
  methods: {
    OnClick () {
      this.$refs.file.click()
    },
    OnFileChange (e) {
      const files = [], fileList = e.target.files
      for (let i = 0; i < fileList.length; i++) {
        files.push(fileList.item(i))
      }
      this.$emit('input', files)
    },
  },
}
</script>

<style scoped>
.file-select {
  display: inline-block;
  width: 100%;
}

.file-select input[type='file'] {
  display: none;
}
</style>
