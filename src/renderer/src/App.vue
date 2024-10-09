<script>
import { CloseSquareOutlined, MinusSquareOutlined } from '@ant-design/icons-vue'

export default {
  components: { CloseSquareOutlined, MinusSquareOutlined },
  mounted() {
    document.title = 'HoneyBToolbox'
    this.$router.push('/menu')
  },
  methods: {
    close() {
      console.log('close')
      window.electron.ipcRenderer.send('close_windows')
    },
    minimize() {
      window.electron.ipcRenderer.send('minimize_windows')
    }
  }
}
</script>

<template>
  <div>
    <div class="top_bar">
      <MinusSquareOutlined class="icon top_bar_tooltip" @click="minimize"></MinusSquareOutlined>
      <CloseSquareOutlined class="icon top_bar_tooltip" @click="close"></CloseSquareOutlined>
    </div>
    <router-view />
  </div>
</template>

<style>
.top_bar {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 35px; /* 高度自行调整 */
  -webkit-app-region: drag; /* 拖拽 */
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
}
.top_bar_tooltip {
  font-size: 25px;
  margin: 5px;
  -webkit-app-region: no-drag;
}

:root {
  font-size: 15px;
}

body {
  font-family: 'Quicksand', sans-serif;
  margin: 0;
  min-height: 100vh;
  background-color: #ffe0f6;
  background-image: radial-gradient(closest-side, rgb(213, 255, 248), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, rgb(255, 198, 217), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(248, 255, 239), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(206, 255, 249), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(214, 255, 194), rgba(248, 192, 147, 0));
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
}

body::after {
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

@keyframes movement {
  0%,
  100% {
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }
  25% {
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }
  50% {
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }
  75% {
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}
/*文本控制*/
.antitext {
  user-select: none; /* Standard syntax */
  -webkit-user-select: none; /* Safari and Chrome */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
img {
  -webkit-user-drag: none; /* Safari */
  user-drag: none; /* 非标准属性，可能不被所有浏览器支持 */
}
</style>
