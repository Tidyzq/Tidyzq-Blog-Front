<template lang='pug'>
  .pagination
    .pagination__pre
      a.pagination__link(v-if='hasPre' :href='getUrl(current - 1)') Newer
    //- .pagination__list
      a.pagination__link(v-for='index in indexes' key='index' :class=`{ 'pagination__link--current': current === index }` :href='getUrl(index)') {{ index + 1 }}
    .pagination__identify Page {{ current + 1 }} of {{ total }}
    .pagination__next
      a.pagination__link(v-if='hasNext' :href='getUrl(current + 1)') Older
</template>

<script>
export default {
  props: {
    baseUrl: {
      type: Object,
      default () {
        const { path, query } = this.$route
        return { path, query }
      },
    },
    current: Number,
    total: Number,
  },
  computed: {
    indexes () {
      return Array(this.total).fill(null).map((v, i) => i)
    },
    hasPre () {
      return this.current !== 0
    },
    hasNext () {
      return this.current !== this.total - 1
    },
  },
  methods: {
    getUrl (index) {
      const { path, query } = this.$route
      const newQuery = Object.assign({}, query, { page: index })
      const { href } = this.$router.resolve({ path, query: newQuery })
      return href
    },
  },
}
</script>

<style lang='less'>
.pagination {
  line-height: 1.6rem;
  display: flex;
}

.pagination__pre, .pagination__next {
  flex: none;
  display: inline-block;
  width: 5rem;
}

.pagination__pre {
  text-align: left;
}

.pagination__next {
  text-align: right;
}

.pagination__identify {
  flex: auto;
  color: #9eabb3;
  text-align: center;
}

.pagination__link {
  display: inline-block;
  padding: 0 15px;
  border: 1px solid #bfc8cd;
  color: #9eabb3;
  text-decoration: none;
  border-radius: 4px;
  transition: all .3s ease;
  &:hover {
    color: #3498db;
    border-color: #3498db;
  }
}
</style>
