<template lang='pug'>
.settings(v-loading='loading')
  portal(to='topbar')
    span Settings
  portal(to='topbar-buttons')
    el-button(type='success', @click='onSave') Save
  el-form
    el-form-item(label='Blog Title')
      el-input(v-model='settings.title')
    el-form-item(label='Blog Description')
      el-input(v-model='settings.description')
    el-form-item(label='Blog Logo')
      cos-select(v-model='settings.logo')
    el-form-item(label='Blog Cover')
      cos-select(v-model='settings.cover')
    el-form-item(label='Post Per Page')
      el-input-number(v-model='settings.postPerPage')
    el-form-item(label='Navigation')
      draggable(v-model='settings.navigation')
        el-card.navigation(v-for='item, index in settings.navigation', key='index')
          el-row(:gutter='20')
            el-col(:span='3')
              label 标题
            el-col(:span='6')
              el-input(v-model='item.name')
            el-col(:span='3')
              label 路径
            el-col(:span='6')
              el-input(v-model='item.path')
            el-col(:span='6')
              el-button(type='danger', @click='onRemoveNavigation(index)') Remove
      el-button(type='primary', @click='onAddNavigation') Add
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'

export default {
  data () {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters([
      'settings',
    ]),
  },
  async created () {
    this.loading = true
    try {
      await this.fetchSettings()
    } catch (e) {
      this.$error(e)
    }
    this.loading = false
  },
  methods: {
    ...mapActions([
      'fetchSettings',
      'updateSettings',
    ]),
    onAddNavigation () {
      this.settings.navigation.push({
        name: '',
        path: '',
      })
    },
    onRemoveNavigation (index) {
      this.settings.navigation.splice(index, 1)
    },
    async onSave () {
      try {
        await this.updateSettings()
        this.$message({
          type: 'success',
          message: 'Update Settings Success',
        })
      } catch (e) {
        this.$error(e)
      }
    },
  },
  components: {
    draggable,
  },
}
</script>

<style>
.navigation {
  width: 100%;
}
</style>
