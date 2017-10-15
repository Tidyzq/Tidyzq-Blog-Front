<template lang='pug'>
.side-menu
  .side-menu__header
    h2.side-menu__blog-name {{ settings.title }}
    .side-menu__line-mod
    .side-menu__user
      img.side-menu__user-avatar(:src='currentUser.avatar')
      .side-menu__user-username {{ currentUser.username }}
      el-button.side-menu__user-logout(type='text', @click='onLogout') logout
  ul.side-menu__body
    li: router-link.side-menu__item(active-class='active', :to=`{ name: 'Users' }`)
      i.fa.fa-users.side-menu__item_icon
      | Users
    li: router-link.side-menu__item(active-class='active', :to=`{ name: 'Documents' }`)
      i.fa.fa-book.side-menu__item_icon
      | Documents
    li: router-link.side-menu__item(active-class='active', :to=`{ name: 'Tags' }`)
      i.fa.fa-tags.side-menu__item_icon
      | Tags
    li: router-link.side-menu__item(active-class='active', :to=`{ name: 'Settings' }`)
      i.fa.fa-cogs.side-menu__item_icon
      | Settings
  ul.side-menu__footer
    li: a.side-menu__item(href='/')
      i.el-icon-menu.side-menu__item_icon
      | Preview
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentUser',
      'settings',
    ]),
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
    async onLogout () {
      this.logout()
      window.location.assign('/console/login')
    },
  },
}
</script>

<style scoped>
.side-menu {
  z-index: 600;
  transition: all .3s ease;
  display: flex;
  flex-direction: column;
  background-color: #f0f6f6;
  width: 12rem;
  border-right: 1px solid #cedfea;
}

.side-menu__header, .side-menu__footer {
  flex: none;
}

.side-menu__blog-name {
  font-size: x-large;
  font-weight: normal;
  display: block;
  margin: 0;
  line-height: 4rem;
  text-align: center;
  color: #171d25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-menu__line-mod {
  margin: 0 1rem;
  border-top: 1px solid #cadbe6;
  border-bottom: 1px solid #f8fbfb;
}

.side-menu__user {
  margin-top: 0.8rem;
  padding-left: 1rem;
}

.side-menu__user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #cadbe6;
  float: left;
  margin-right: 0.5rem;
}

.side-menu__user-username {
  color: #171d25;
  font-size: 1.1rem;
  line-height: 2rem;
}

.side-menu__user-logout {
  padding: 0;
  line-height: 1rem;
}

.side-menu__body, .side-menu__footer {
  list-style: none;
  margin: 0;
  padding-left: 0;
}

.side-menu__body {
  margin-top: 2rem;
  flex: auto;
}

.side-menu__item {
  cursor: pointer;
  line-height: 3rem;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all .3s ease;
  color: #586376;
}

.side-menu__item:before {
  content: '';
  display: inline-block;
  width: 0.4rem;
  margin-right: 1rem;
  height: 3rem;
  background-color: transparent;
  vertical-align: top;
}

.side-menu__item:hover, .side-menu__item.active {
  color: #2277da;
  background-color: #d5e2ef;
}

.side-menu__item_icon {
  margin-right: 0.5rem;
}

.side-menu__item.active:before {
  background-color: #2277da;
}

</style>
