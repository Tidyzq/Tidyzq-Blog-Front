<template lang='pug'>
  .user
    img.user__avatar(:src='user.avatar')
    .user__username {{ user.username }}
</template>

<script>
export default {
  props: {
    user: Object,
  },
}
</script>

<style>
.user__avatar {
  display: inline-block;
  vertical-align: top;
  line-height: 2rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.user__username {
  display: inline-block;
  vertical-align: top;
  height: 2rem;
  line-height: 2rem;
  color: #9eabb3;
}
</style>
