<template lang='pug'>
.cos-select
  .cos-select__preview_box(@click='showSelectDialog = true')
    img.cos-select__preview(:src='value')
  el-dialog(title='Select File', :visible.sync='showSelectDialog')
    .cos-select__file-list
      el-card.file-list-item(v-for='file in files', key='file.key', :body-style="{ padding: '0px' }")
        .file-list-item__preview
          img.file-list-item__image(:src='file.url', @click='selectedFile = file.url')
        .file-list-item__desc
          span.file-list-item__name {{ file.key }}
          el-button(type='danger', size='mini', @click='onDelete(file.key)') Delete
    div(slot='footer')
      file-select(@input='onSelectUpload', multiple)
        el-button(slot='trigger') Upload
      el-button(@click='showSelectDialog = false') Cancel
      el-button(type='primary', @click='onSelectConfirm') Confirm
</template>

<script>
import { Cos } from '@/apis'
import config from '@/config'

export default {
  props: {
    value: String,
    disabled: Boolean,
  },
  data () {
    return {
      files: [],
      showSelectDialog: false,
      selectedFile: '',
    }
  },
  watch: {
    showSelectDialog (newVal) {
      if (newVal) {
        this.selectedFile = ''
        this.fetchFileList()
      }
    },
  },
  methods: {
    fetchFileList () {
      Cos.get()
        .then(({ Contents: files }) => files)
        .then(files => files.map(file => Object.assign({ key: file.Key, url: `${config.cos.cdnUrl}/${file.Key}` })))
        .then(files => { this.files = files })
    },
    onSelectConfirm () {
      this.$emit('input', this.selectedFile)
      this.showSelectDialog = false
    },
    onSelectUpload (files) {
      // TODO upload progress
      Promise.all(files.map(file => Cos.put(file)))
        .then(() => {
          this.fetchFileList()
        })
    },
    onDelete (key) {
      Cos.delete(key)
        .then(() => {
          this.fetchFileList()
        })
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
  height: 100%;
  width: 100%;
  vertical-align: top;
}

.cos-select__preview {
  min-height: 100px;
  max-width: 100%;
  min-height: 100px;
  max-height: 20rem;
  vertical-align: top;
}

.cos-select__file-list {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
}

.file-list-item {
  width: 10rem;
  display: inline-block;
  vertical-align: top;
  margin: 0 0.3rem;
}

.file-list-item__preview {
  height: 10rem;
  width: 10rem;
  position: relative;
}

.file-list-item__image {
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.file-list-item__desc {
  height: 4rem;
  width: 10rem;
}

</style>

