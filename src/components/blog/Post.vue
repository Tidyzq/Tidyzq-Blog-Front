<template lang='pug'>
  article.post
    .post__meta
      .post__tags
        tag.post__tag(v-for='tag in post.tags' key='tag.id' :tag='tag')
      time.post__date {{ createdAtFormated }}
    //- router-link.post__title(:to=`{ name: 'PostDetail', params: { url: post.url } }`) {{ post.title }}
    a.post__title(:href='`/blog/post/${post.url}`') {{ post.title }}
    p.post__abstract {{ post.abstract }}
    user.post__author(:user='post.author')
</template>

<script>
import User from './User'
import Tag from './Tag'

export default {
  name: 'post',
  props: {
    post: Object,
  },
  components: {
    Tag,
    User,
  },
  computed: {
    createdAtFormated () {
      return (this.post && this.post.createdAtFormated) || ''
    },
  },
}
</script>

<style>
.post__tags {
  display: inline;
}

.post__date {
  display: inline;
  float: right;
  line-height: 1.6rem;
  color: #b5b5b5;
}

.post__title {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #34495e;
  margin: 2.5rem 0;
  text-decoration: none;
  transition: all .3s ease;
}

.post__title:hover {
  color: #5e5e5e;
}
</style>

