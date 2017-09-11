<template lang='pug'>
.tag-page(:class=`{
    'show-list': !showDetail,
    'show-detail': showDetail
  }`)
  //- 顶栏
  template(v-if='!showDetail')
    portal(to='topbar')
      span Tags
    portal(to='topbar-buttons')
      el-button(type='primary', @click='showNewTagDialog = true') New
  //- 新标签弹出框
  new-tag-dialog(:visiable.sync='showNewTagDialog', @created='onCreateSuccess')
  article
    .tag-list(v-loading='loading')
      .tag-list-item(v-for='tag in tags', key='tag.id')
        router-link(:to=`{ name: 'TagDetail', params: { tagId: tag.id } }`)
          span {{ tag.id }}
          span {{ tag.name }}
    router-view.tag-detail
</template>

<script>
import { Tag } from '@/apis/index'
import NewTagDialog from './NewTagDialog'

export default {
  components: {
    NewTagDialog,
  },
  data () {
    return {
      tags: [],
      showNewTagDialog: false,
      loading: false,
    }
  },
  computed: {
    showDetail () {
      return this.$route.name === 'TagDetail'
    },
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      Tag.get()
        .then(({ body: tags }) => {
          this.tags = tags
          this.loading = false
        })
    },
    onCreateSuccess () {
      this.$message({
        type: 'success',
        message: 'Create Tag Success',
      })
      this.fetchData()
    },
  },
}
</script>

<style scoped>
article {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.tag-list, .tag-detail {
  width: 100%;
  flex: auto;
  overflow: hidden;
}

@media only screen and (max-width: 991px) {
  .show-detail .tag-list, .show-list .tag-detail {
    display: none;
  }
}
</style>
