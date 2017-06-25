<template lang='pug'>
.console-page
  side-menu.sidebar(:class=`{ open: openSidebar }`)
  .main-content(@click='OnClickMainContent')
    topbar.topbar
    router-view.secondary-content
</template>

<script>
import { mapActions } from 'vuex'
import SideMenuEvent from '@/event-buses/SideMenu'

export default {
  data () {
    return {
      openSidebar: false,
    }
  },
  created () {
    this.checkLogin()
      .catch(() => {
        window.location.assign('/console/login')
      })
    SideMenuEvent.$on('toggle', () => {
      this.openSidebar = !this.openSidebar
    })
    SideMenuEvent.$on('open', () => {
      this.openSidebar = true
    })
    SideMenuEvent.$on('close', () => {
      this.openSidebar = false
    })
  },
  methods: {
    ...mapActions([
      'checkLogin',
    ]),
    OnClickMainContent () {
      SideMenuEvent.$emit('close')
    },
  },
}
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  border: 0;
  padding: 0;
}
</style>

<style scoped>
.console-page {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-direction: row;
  position: relative;
}

.header {
  flex: none;
  height: 4rem;
  /*background: blue;*/
}

.brand {
  height: 100%;
  width: 16rem;
  /*background: yellow;*/
  display: none;
  margin: 0;
}

.header-content {
  display: inline-block;
}

/* xs */
@media only screen and (max-width: 767px) {
  .sidebar {
    z-index: 600;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: none;
  }
}

.main-content {
  flex: auto;
  /*background: green;*/
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-content: stretch;
  position: relative;
}

.topbar {
  flex: none;
}

.secondary-content {
  position: relative;
  flex: auto;
  overflow: hidden;
}

.sidebar {
  flex: none;
  transition: transform .3s linear;
  /*width: 16rem;*/
}

</style>
