<template lang='pug'>
  #app
    router-view.main-content
    footer.footer
      .copyright Copyright © Tidyzq {{ new Date().getFullYear() }}
      a.poweredby(href='http://www.miitbeian.gov.cn') 粤ICP备15094345号-1
</template>

<script>
import { mapGetters } from 'vuex'

import HeadMixin from '../mixins/head'

export default {
  mixins: [
    HeadMixin,
  ],
  async asyncData ({ store }) {
    await store.dispatch('fetchSettings')
  },
  title () {
    return this.settings.title
  },
  description () {
    return this.settings.description
  },
  favicon () {
    return this.settings.logo
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
  },
}
</script>

<style lang='less'>
html, body {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

a {
  color: #bbc7cc;
  transition: all .3s ease;
  text-decoration: none;
  &:hover {
    color: #3498db;
  }
}

.footer {
  margin-top: 6rem;
  padding: 1rem;
  overflow: hidden;
}

.copyright, .poweredby {
  font-size: small;
  color: #bbc7cc;
}

.copyright {
  float: left;
}

.poweredby {
  float: right;
}
</style>
