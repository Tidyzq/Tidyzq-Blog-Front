<template lang='pug'>
  //- a.tag(:href='`/blog/tag/${tag.url}`') {{ tag.name }}
  .tag {{ tag.name }}
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
  padding: 0.5rem;
  color: #fff;
  border-radius: 4px;
  background: #0085c3;
  text-decoration: none;
}

.tag + .tag {
  margin-left: 6px;
}
</style>
