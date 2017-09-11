<template lang='pug'>
.side-menu
  .menu-header
    img.user-avatar(:src='currentUser.avatar', width='50')
    .user-username {{ currentUser.username }}
  ul.menu-body
    li: router-link.menu-item(active-class='active', :to=`{ name: 'Users' }`)
        i.el-icon-menu
        | Users
    li: router-link.menu-item(active-class='active', :to=`{ name: 'Documents' }`)
        i.el-icon-menu
        | Documents
    li: router-link.menu-item(active-class='active', :to=`{ name: 'Tags' }`)
        i.el-icon-menu
        | Tags
    li: router-link.menu-item(active-class='active', :to=`{ name: 'Settings' }`)
        i.el-icon-menu
        | Settings
    //- li.menu-item
    //-   router-link(active-class='active', :to=`{ name: 'Tags' }`)
    //-     i.el-icon-menu
    //-     | Tags
    //- li.menu-item
    //-   router-link(active-class='active', :to=`{ name: 'Settings' }`)
    //-     i.el-icon-menu
    //-     | Settings
  ul.menu-footer
    li: a.menu-item
      i.el-icon-menu
      | Preview
    li: a.menu-item(@click='onLogout')
      i.el-icon-menu
      | Logout
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentUser',
    ]),
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
    onLogout () {
      this.logout()
        .then(() => {
          window.location.assign('/console/login')
        })
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
  background-color: #1d8ce0;
  color: #e5e9f2;
}

.menu-header, .menu-footer {
  flex: none;
}

.menu-body {
  flex: auto;
}

.menu-body, .menu-footer {
  list-style: none;
  margin: 0;
  padding-left: 0;
}

.menu-item {
  cursor: pointer;
  padding: 0 10px 0 0;
  line-height: 32px;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all .3s ease;
}

.menu-item:before {
  content: '';
  display: inline-block;
  width: 4px;
  margin-right: 6px;
  height: 32px;
  background-color: transparent;
  vertical-align: top;
}

.menu-item:hover {
  color: #c0ccda;
}

.menu-item i {
  margin-right: 4px;
}

.menu-item.active {
  color: #58b7FF;
}

.menu-item.active:before {
  background-color: #58b7FF;
}

</style>
