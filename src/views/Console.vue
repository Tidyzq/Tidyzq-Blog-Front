<template lang='pug'>
.console-page
  side-menu.sidebar(:menus='Menus', @select='onSelect')
  .main-content
    topbar
    router-view.secondary-content
</template>

<script>
import { mapActions } from 'vuex'

const Menus = [{
  name: 'Users',
  icon: 'menu',
  index: 'Users',
}, {
  name: 'Documents',
  icon: 'menu',
  index: 'Documents',
}]

export default {
  data () {
    return {
      Menus,
    }
  },
  created () {
    this.readFromStorage()
      .then(({ accessToken, currentUser }) => {
        if (!accessToken || !currentUser) {
          // TODO check login
          this.gotoLogin()
        }
      })
  },
  methods: {
    ...mapActions([
      'readFromStorage',
    ]),
    gotoLogin () {
      window.location.assign('/console/login')
    },
    onSelect (index) {
      this.$router.push({ name: index })
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

@media only screen and (min-width: 768px) {
  .brand {
    display: inline-block;
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

.secondary-content {
  height: 100%;
  width: 100%;
}

.sidebar {
  flex: none;
  width: 16rem;
}

.body {
  flex: auto;
  /*background: grey;*/
}

</style>
