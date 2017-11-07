<template lang='pug'>
  .posts(ref='container')
    .posts__header(:class=`{
        'posts__header--simplify': simplifyCover,
      }`
      )
      navbar.posts__navbar(type='dark')
      .posts__cover(:style=`{
        'background-image': 'url(' + settings.cover + ')',
      }`)
        .posts__header-content
          .posts__title {{ settings.title }}
          .posts__description {{ settings.description }}
        .posts__scroll-down(v-if='!simplifyCover' @click='onScrollDown')
          i.fa.fa-4x.fa-angle-down
        //- a.posts__scroll-down(v-if='!simplifyCover' href='#content')
    #content.posts__body(ref='content')
      .posts__posts-list
        .posts__item-container(v-for='post in data.posts' key='post.id')
          post.posts__item(:post='post')
      .posts__pagination
        pagination(:current='index' :total='data.pageCount')
      //- pagination
    .posts__footer
</template>

<script>
import { mapGetters } from 'vuex'

import Navbar from '@/components/blog/Navbar'
import Post from '@/components/blog/Post'
import Pagination from '@/components/blog/Pagination'

import ScrollMixin from '@/mixins/scroll'

export default {
  components: {
    Post,
    Navbar,
    Pagination,
  },
  mixins: [
    ScrollMixin,
  ],
  asyncData ({ store, route }) {
    const index = parseInt(route.query.page) || 0
    return store.dispatch('fetchPosts', index)
  },
  computed: {
    ...mapGetters([
      'settings',
      'data',
    ]),
    index () {
      return parseInt(this.$route.query.page) || 0
    },
    simplifyCover () {
      return this.index !== 0
    },
  },
  mounted () {
    window.myScrollTo = this.scrollTo
  },
  methods: {
    /**
     * @param {HTMLElement} elem
     */
    getOffsetTop (elem) {
      let offset = 0
      do {
        if (!isNaN(elem.offsetTop)) {
          offset += elem.offsetTop
        }
      } while ((elem = elem.offsetParent))
      return offset
    },
    getRealScroll () {
      return window.scrollY
    },
    setRealScroll (val) {
      return window.scrollTo(0, val)
    },
    onScrollDown () {
      const contentOffset = this.getOffsetTop(this.$refs.content)
      const maxOffset = document.body.clientHeight - window.innerHeight
      this.scrollTo(Math.min(contentOffset, maxOffset), 500)
    },
  },
}

</script>

<style>
.posts__header {
  display: block;
  overflow: hidden;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.posts__header--simplify {
  height: 40vh;
}

.posts__navbar {
  flex: none;
}

.posts__cover {
  flex: auto;
  position: relative;
  background: transparent no-repeat 50%;
  background-size: cover;
  overflow: hidden;
}


.posts__header-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  text-shadow: 0 0 15px black;
}

.posts__title {
  font-size: 4rem;
  font-weight: 700;
}

.posts__description {
  font-size: 1.4rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, to {
    transform: translate(-50%, 0);
  }
  40% {
    transform: translate(-50%, 1rem)
  }
  60% {
    transform: translate(-50%, 0.5rem)
  }
}

.posts__scroll-down {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  transform: translate(-50%);
  text-align: center;
  color: #fff;
  text-shadow: 0 0 15px black;
  cursor: pointer;
  animation: bounce 4s 2s infinite;
}

.posts__body {
  overflow: hidden;
}

.posts__posts-list > *:nth-child(even) {
  background: #f9f9f9;
}

.posts__item {
  max-width: 60rem;
  margin: auto;
  padding: 2rem 0;
}

.posts__pagination {
  max-width: 60rem;
  margin: auto;
}

</style>
