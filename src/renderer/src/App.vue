<script>
import { CloseSquareOutlined, MinusSquareOutlined } from '@ant-design/icons-vue'

export default {
  components: { CloseSquareOutlined, MinusSquareOutlined },
  methods: {
    close() {
      console.log('close')
      window.electron.ipcRenderer.send('close_windows')
    },
    minimize() {
      window.electron.ipcRenderer.send('minimize_windows')
    },
    async find_jx3_user() {
      this.isLoading = true
      let res = await window.electron.ipcRenderer.invoke('find_jx3_user')
      console.log(res)
      this.isLoading = false
    }
  },
  mounted() {
    document.title = 'HoneyBToolbox'
    this.$router.push('/menu')
  }
}
</script>

<template>
  <div>
    <div class="top_bar">
      <MinusSquareOutlined class="icon top_bar_tooltip" @click="minimize"></MinusSquareOutlined>
      <CloseSquareOutlined class="icon top_bar_tooltip" @click="close"></CloseSquareOutlined>
    </div>
    <router-view/>
  </div>
</template>

<style>
body {
  background-image: linear-gradient(to right, #eafbf9 0%, #f3ebf1 80%);
}
</style>
