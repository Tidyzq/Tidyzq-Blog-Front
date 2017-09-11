<template lang='pug'>
.settings
  portal(to='topbar')
    span Settings
  portal(to='topbar-buttons')
    el-button(type='success') Save
  el-form
    el-form-item(label='Blog Title')
      el-input
    el-form-item(label='Blog Description')
      el-input
    el-form-item(label='Blog Logo')
      el-input
    el-form-item(label='Blog Cover')
      el-input
    el-form-item(label='Post Per Page')
      el-input
    el-form-item(label='Navigation')
      el-input
</template>

<script>
export default {

}
</script>

<style>

</style>
