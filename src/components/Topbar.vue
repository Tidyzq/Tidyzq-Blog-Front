<template lang='pug'>
header.topbar
  slot
  .topbar-buttons
    slot(name='button')
</template>

<script>

</script>

<style scoped>

.topbar {
  height: 4rem;
  width: 100%;
  background: blue;
}

.topbar-buttons {
  height: 100%;
  float: right;
}

</style>
