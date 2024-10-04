<script>
export default {
  setup(){

  },
  data() {
    return {
      open: false,
      isLoading: false
    }
  },
  methods: {
    handleOk() {
      this.open = false
    },
    showModal() {
      this.open = true
    },
  },
}
</script>

<template>
<!--  <div class="loading" v-show="isLoading">-->
<!--    <div class="loading_bak">-->
<!--      <div class="loading_gif">-->
<!--        <img src="../assets/loading/dog_loading.svg">-->
<!--      </div>-->
<!--      <div class="loading_font">正在加载中...</div>-->
<!--    </div>-->
<!--  </div>-->

  <div class="menu_card_box">
    <div class="menu_card_row" style="padding-top: 30px">
      <router-link to="/find_jx3_user">
        <a-card hoverable class="menu_card icon">
          <p class="card_font" style="margin: -20px 0 0 0">备份数据</p>
        </a-card>
      </router-link>

      <a-card hoverable class="menu_card icon">
        <p style="font-size: 18px">这是两个占位按钮</p>
      </a-card>
      <a-card hoverable class="menu_card icon">
        <p style="font-size: 18px">按下也没有用(</p>
      </a-card>
      <router-link to="/setting">
        <a-card hoverable class="menu_card icon">
          <p class="card_font" style="margin: 5px 0 0 0">设定</p>
        </a-card>
      </router-link>

      <router-view></router-view>
    </div>

    <!--    <div class="menu_card_row">-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--    </div>-->
    <!--    <div class="menu_card_row">-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--      <a-card hoverable class="menu_card">-->
    <!--        <p>Card content</p>-->
    <!--      </a-card>-->
    <!--    </div>-->
  </div>
</template>

<style>
body {
  background-image: linear-gradient(to right, #eafbf9 0%, #f3ebf1 80%);
}
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 5px; /* 滚动条宽度 */
  height: 12px; /* 垂直滚动条的高度 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: darkgrey; /* 滑块颜色 */
  border-radius: 10px; /* 滑块圆角 */
  border: 2px solid transparent; /* 滑块边框 */
  background-clip: content-box; /* 确保边框和内边距被包含在背景中 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道颜色 */
  border-radius: 10px; /* 轨道圆角 */
}

/* 当鼠标悬停在滑块上时 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 鼠标悬停时的颜色 */
}
.top_bar {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 35px; /* 高度自行调整 */
  -webkit-app-region: drag; /* 拖拽 */
  background-image: linear-gradient(to right, #c0fff9 0%, #ffd4e2 80%);
  display: flex;
  justify-content: flex-end;
}
.top_bar_tooltip {
  font-size: 25px;
  margin: 5px;
  -webkit-app-region: no-drag;
}

@keyframes rotate-icon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(8deg);
  }
}

.icon {
  display: inline-block; /* 确保可以应用动画 */
}

.icon:hover {
  animation: rotate-icon 0.2s linear forwards; /* 应用动画 */
}

.menu_card {
  margin-top: 40px;
  margin-bottom: 40px;
  width: 130px;
  height: 130px;
  background-color: rgb(255, 212, 226);
  border: 5px solid #ffffff;
}
.menu_card_box {
  height: 600px;
  display: block;
}
.menu_card_row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.card_font {
  font-size: 36px;
}
</style>
