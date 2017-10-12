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
      template(v-for='tag in tags')
        router-link.tag-list__item(key='tag.id', :to=`{ name: 'TagDetail', params: { tagId: tag.id } }`)
          .tag-list__name {{ tag.name }}
          .tag-list__url /{{ tag.url }}
        .tag-list__line-mod(key='tag.id')
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
    async fetchData () {
      this.loading = true
      try {
        const { body: tags } = await Tag.get()
        this.tags = tags
      } catch (e) {
        this.$error(e)
      }
      this.loading = false
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
  overflow: auto;
}

.tag-list {
  flex: 1 2 auto;
}

.tag-detail {
  flex: 2 1 auto;
}

.show-detail .tag-list {
  border-right: solid 1px #cadbe6
}

@media only screen and (max-width: 991px) {
  .show-detail .tag-list, .show-list .tag-detail {
    display: none;
  }
}

.tag-list__item {
  display: block;
  text-decoration: none;
  cursor: pointer;
  height: 3rem;
  padding: 0.5rem 1rem 0.5rem 2rem;
}

.tag-list__line-mod {
  margin: 0 1rem;
  border-bottom: solid 1px #cadbe6;
}

.tag-list__name {
  line-height: 2rem;
  font-size: 1.1rem;
  color: #171d25;
}

.tag-list__item:hover {
  background: #EAF3FD;
}

.tag-list__url {
  color: #a2a2a2;
  line-height: 1rem;
  font-size: 0.8rem;
}

</style>
