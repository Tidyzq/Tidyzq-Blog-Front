<template lang="pug">
  el-dialog(title='Select File', :visible.sync='visiable', size='large', :before-close='onSelectCancel')
    .cos-select__url-input
      el-input(v-model='selectedFile')
    .cos-select__file-list(v-loading='loading')
      el-card.file-list-item(v-for='file in files', key='file.key', :body-style="{ padding: '0px' }")
        .file-list-item__preview(@click='selectedFile = file.url')
          img.file-list-item__image(:src='file.url')
        .file-list-item__desc(@click='selectedFile = file.url')
          p.file-list-item__name {{ file.key }}
        i.file-list-item__check.el-icon-circle-check(v-if='selectedFile === file.url')
        i.file-list-item__delete.el-icon-circle-cross(@click='onDelete(file.key)')
      el-card.file-list-item.upload-item(:body-style="{ padding: '0px' }")
        el-progress.upload-item__progress(v-if='uploading', type='circle', :percentage='uploadProgress', :status='uploadStatus')
        file-select(v-else, @input='onSelectUpload', multiple, accept='image/png,image/jpeg,image/gif')
          el-button.upload-item__button(slot='trigger', type='text', icon='plus')
    div(slot='footer')
      el-button(@click='onSelectCancel') Cancel
      el-button(type='primary', @click='onSelectConfirm') Confirm
</template>

<script>
import { Cos } from '@/apis'
import config from '@/config'

export default {
  data () {
    return {
      files: [],
      visiable: false,
      selectedFile: '',
      uploading: false,
      uploadProgress: 0,
      uploadStatus: '',
      loading: false,
    }
  },
  watch: {
    visiable (newVal) {
      if (newVal) {
        this.selectedFile = ''
        this.fetchFileList()
      }
    },
  },
  created () {
    this.$on('open', () => {
      this.visiable = true
    })
  },
  methods: {
    async fetchFileList () {
      this.loading = true
      try {
        const { Contents } = await Cos.get()
        const files = Contents.map(file => ({
          key: file.Key,
          url: `${config.cos.cdnUrl}/${file.Key}`,
        }))
        this.files = files
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
    },
    onSelectConfirm () {
      this.$emit('select', this.selectedFile)
      this.visiable = false
    },
    onSelectCancel () {
      this.$emit('select', null)
      this.visiable = false
    },
    onDialogClose (done) {
      this.$emit('select', null)
      done()
    },
    getUploadProgressHandlers (files) {
      const totalSize = files.reduce((total, file) => total + file.size, 0)
      const progresses = new Array(files.length).fill(0)
      let sumProgress = 0
      return index => {
        return e => {
          if (e.lengthComputable) {
            sumProgress += e.loaded - progresses[index]
            progresses[index] = e.loaded
            this.uploadProgress = Math.floor(sumProgress * 1000 / totalSize) / 10 // keep one decimal
          }
        }
      }
    },
    async onSelectUpload (files) {
      try {
        const progressHandlers = this.getUploadProgressHandlers(files)
        this.uploading = true
        this.uploadStatus = ''
        await Promise.all(files.map((file, i) => Cos.put(file, progressHandlers(i))))
        this.uploadStatus = 'success'
        await this.fetchFileList()
        this.uploading = false
      } catch (e) {
        this.uploadStatus = 'exception'
        this.$error(e)
      }
    },
    async onDelete (key) {
      try {
        if (await this.$confirm('Delete file', 'Are you sure to delete this file?')) {
          this.loading = true
          await Cos.delete(key)
          this.fetchFileList()
        }
      } catch (e) {
        this.$error(e)
      }
    },
  },
}
</script>

<style scoped>

.cos-select__file-list {
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
}

.file-list-item {
  width: 10rem;
  height: 14rem;
  display: inline-block;
  vertical-align: top;
  margin: 0 0.3rem;
  position: relative;
}

.file-list-item__preview {
  height: 10rem;
  width: 100%;
  position: relative;
  cursor: pointer;
}

.file-list-item__image {
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.file-list-item__desc {
  height: 4rem;
  width: 100%;
  overflow: hidden;
}

.file-list-item__name {
  margin: 0.5rem 0 0 0;
  width: 100%;
  white-space: normal;
  text-align: center;
}

.file-list-item__check {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  font-size: 2rem;
  color: #20a0ff;
  opacity: 0.6;
}

.file-list-item:hover .file-list-item__delete {
  display: block;
}

.file-list-item__delete {
  display: none;
  position: absolute;
  right: 1.3rem;
  top: 1.3rem;
  transform: translate(50%, -50%);
  font-size: 1rem;
  transition: all 0.1s ease;
  color: #ff4949;
  cursor: pointer;
  box-shadow: 1px 1px 5px black;
  border-radius: 50%;
}

.file-list-item__delete:hover {
  font-size: 1.5rem;
}

.upload-item {
  position: relative;
}

.upload-item__button {
  width: 100%;
  height: 14rem;
}

.upload-item__progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>


