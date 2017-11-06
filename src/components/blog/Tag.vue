<template lang='pug'>
  //- router-link.tag(:to=`{ name: 'TagDetail', params: { url: tag.url } }`) {{ tag.name }}
  a.tag(:href='`/blog/tag/${tag.url}`') {{ tag.name }}
</template>

<script>
export default {
  name: 'Tag',
  props: {
    tag: Object,
  },
}
</script>

<style>
.tag {
  display: inline-block;
  line-height: 1rem;
  padding: 0.3rem;
  color: #fff;
  border-radius: 4px;
  text-transform: uppercase;
  background: #0085c3;
  text-decoration: none;
}

.tag + .tag {
  margin-left: 6px;
}
</style>
