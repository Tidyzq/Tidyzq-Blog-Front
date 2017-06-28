<template lang='pug'>
  .tag-detail
    portal(to='topbar')
       span Tags
       span {{ tagId }}
    portal(to='topbar-buttons')
      el-button(type='success', @click='onSave') Save
    el-form
      el-form-item(label='Name')
        el-input(v-model='tag.name')
      el-form-item(label='Url')
        form-plain-text {{ tag.url }}
</template>

<script>
import { Tag } from '@/apis/index'

export default {
  data () {
    return {
      tag: {},
    }
  },
  computed: {
    tagId () {
      return Number.parseInt(this.$route.params.tagId)
    },
  },
  watch: {
    tagId () {
      this.fetchData()
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      Tag.Id.get({ tagId: this.tagId })
        .then(({ body: tag }) => {
          this.tag = tag
        })
    },
    onSave () {
      Tag.Id.update({
        tagId: this.tagId,
      }, {
        name: this.tag.name,
        url: this.tag.url,
      })
        .then(() => this.$message({
          type: 'success',
          message: 'Update Tag Success',
        }))
        .catch(err => this.onError(err))
    },
    onError (err) {
      err = err && err.body ? err.body : err
      this.$message({
        message: err,
        type: 'error',
      })
    },
  },
}
</script>

<style scoped>
.tag-detail {
  background: green;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
