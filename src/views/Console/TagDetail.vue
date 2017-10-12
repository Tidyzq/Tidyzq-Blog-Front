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
        el-input(v-model='tag.url')
      el-form-item
        el-button(type='danger', @click='onDelete') Delete
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
  beforeRouteUpdate (to, from, next) {
    next()
    this.fetchData()
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        const { body: tag } = await Tag.Id.get({ tagId: this.tagId })
        this.tag = tag
      } catch (e) {
        if (e && e.status && e.status === 404) {
          this.goToTagList()
        } else {
          this.$error(e)
        }
      }
    },
    async onSave () {
      try {
        await Tag.Id.update({
          tagId: this.tagId,
        }, {
          name: this.tag.name,
          url: this.tag.url,
        })
        this.$message({
          type: 'success',
          message: 'Update Tag Success',
        })
      } catch (e) {
        this.$error(e)
      }
    },
    async onDelete () {
      try {
        if (await this.$confirm('Are you sure to delete this tag?', 'Delete Tag')) {
          await Tag.Id.delete({
            tagId: this.tagId,
          })
          this.$message({
            type: 'success',
            message: 'Delete Tag Success',
          })
          this.goToTagList()
        }
      } catch (e) {
        this.$error(e)
      }
    },
    goToTagList () {
      this.$router.push({ name: 'Tags' })
    },
  },
}
</script>

<style scoped>
.tag-detail {
  padding: 0.5rem 1rem;
  overflow: auto;
}
</style>
