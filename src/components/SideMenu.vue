<script>
export default {
  props: {
    menus: Array,
    value: Boolean,
  },
  computed: {
    active: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      },
    },
  },
  render (h) {
    return h(
      'el-menu',
      {
        staticClass: 'sidemenu',
        class: {
          'sidemenu-active': this.active,
        },
        on: {
          select: (index, indexPath) => {
            this.handleSelect(index, indexPath)
          },
        },
      },
      this.renderMenu.call(this._renderProxy, this.menus, h)
    )
  },
  methods: {
    renderMenu (menus, h) {
      return menus.map(menu => {
        if (menu.children) {
          const children = this.renderMenu.call(this._renderProxy, menu.children, h)
          children.unshift(h(
            'template',
            {
              slot: 'title',
            },
            [
              menu.icon ? h('i', { class: `el-icon-${menu.icon}`}) : null,
              menu.name,
            ]
          ))
          return h(
            'el-submenu',
            {
              domProps: {
                index: menu.index,
              },
            },
            children
          )
        } else {
          return h(
            'el-menu-item',
            {
              domProps: {
                index: menu.index,
              },
            },
            [
              menu.icon ? h('i', { class: `el-icon-${menu.icon}`}) : null,
              menu.name,
            ]
          )
        }
      })
    },
    handleSelect (index, indexPath) {
      this.$emit('select', index, indexPath)
      this.active = false
    },
  },
}
</script>

<style scoped>
.sidemenu {
  z-index: 10;
  border-radius: 0;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: all .3s ease;
}

@media only screen and (min-width: 768px) {
  .sidemenu {
    position: static;
    height: initial;
    transform: translateX(0);
  }
}

.sidemenu-active {
  transform: translateX(0);
}
</style>
