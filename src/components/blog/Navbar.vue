<template lang='pug'>
  nav.navbar(:class=`{
    'navbar--default': type === 'default',
    'navbar--dark': type === 'dark',
  }`)
    .navbar__container
      .navbar__header
        a.navbar__brand(href='/') {{ settings.title }}
      .navbar__navs
        a.navbar__nav(v-for='nav, i in settings.navigation' key='i' :href='nav.path') {{ nav.name }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
  async asyncData ({ store }) {
    await store.dispatch('fetchSettings')
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
  },
}
</script>

<style lang='less'>
.navbar {
  margin: 0;
  border: 0;
  width: 100%;
  height: 4rem;
  &--default {
    & .navbar__container {
      background: #f0f6f6;
    }
    & .navbar__brand {
      color: #4b4b4b;
    }
    & .navbar__nav {
      color: #4b4b4b;
      &:hover {
        color: #2277da;
        background: #d5e2ef;
      }
    }
  }
  &--dark {
    & .navbar__container {
      background: #2a303c;
    }
    & .navbar__brand {
      color: #fff;
    }
    & .navbar__nav {
      color: #fff;
      &:hover {
        background: #185398;
      }
    }
  }
}

.navbar__container {
  position: relative;
  width: 100%;
  height: 4rem;
  line-height: 4rem;
  padding: 0 1rem;
  box-sizing: border-box;
}

.navbar__header, .navbar__navs {
  height: 4rem;
}

.navbar__header {
  float: left;
}

.navbar__navs {
  float: right;
}

.navbar__brand, .navbar__nav {
  display: inline-block;
  height: 100%;
  text-decoration: none;
  font-size: large;
  transition: all .3s ease-in;
}

.navbar__nav {
  padding: 0 0.5rem;
}

</style>
