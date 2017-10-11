<template lang='pug'>
  header.topbar
    .topbar__wrapper
      button.topbar__toggle(type='button', @click='OnToggle')
        i.fa.fa-angle-double-right
      .topbar__body
        portal-target(name='topbar')
      .topbar__buttons
        portal-target(name='topbar-buttons')
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

<style>

.topbar {
  height: 4rem;
  width: 100%;
  background: #2a303c;
  color: #fff;
}

.topbar__wrapper {
  height: 100%;
  padding: 0 2rem;
}

.topbar__toggle {
  display: none;
  position: absolute;
  top: 1rem;
  left: 0;
  overflow: hidden;
  width: 1rem;
  height: 2rem;
  border: 1px solid #c7e0ef;
  border-left: none;
  border-radius: 0 3px 3px 0;
  background: #f7fdfd;
  /* background: url(img/top-menu.png) -72px -40px no-repeat #f7fdfd; */
}

@media only screen and (max-width: 767px) {
  .topbar__toggle {
    display: initial;
  }
}

.topbar__body, .topbar__buttons {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  line-height: 4rem;
}

.topbar__body {
  font-size: large;
}

.topbar__body span + span {
  margin-left: 0.5rem;
}

.topbar__body span + span:before {
  content: '/';
  margin-right: 0.5rem;
}

.topbar__body input {
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: white;
  font-size: large;
}

.topbar__buttons {
  float: right;
}

</style>
