<template lang='pug'>
  header.topbar
    button.topbar-toggle(type='button', @click='OnToggle')
      i.fa.fa-2x.fa-bars
    portal-target.topbar-body(name='topbar')
    portal-target.topbar-buttons(name='topbar-buttons')
</template>

<script>
import SideMenuEvent from '@/event-buses/SideMenu'

export default {
  methods: {
    OnToggle (e) {
      SideMenuEvent.$emit('toggle')
      e.stopPropagation()
    },
  },
}
</script>

<style scoped>

.topbar {
  height: 4rem;
  width: 100%;
  background: blue;
}

.topbar-toggle {
  display: none;
}

@media only screen and (max-width: 767px) {
  .topbar-toggle {
    display: initial;
  }
}

.topbar-body, .topbar-buttons {
  height: 100%;
  display: inline-block;
  vertical-align: top;
}

</style>
