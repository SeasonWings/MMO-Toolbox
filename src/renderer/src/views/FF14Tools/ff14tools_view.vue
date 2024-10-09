<script>
import { LeftOutlined, QuestionOutlined } from '@ant-design/icons-vue'

export default {
  components: { QuestionOutlined, LeftOutlined },
  setup() {},
  data() {
    return {
      open: false,
      isLoading: false,
      // tour
      tour_open: false,
      steps: [
        {
          title: '如你所见',
          description:
            '这里只是更加单纯的选择指定游戏里支持的工具,目前仅支持自动生产脚本，没有更多了！'
        }
      ]
    }
  },
  mounted() {},
  methods: {}
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

  <div class="menu_card_box antitext">
    <div class="menu_card_row" style="padding-top: 30px">
      <div>
        <router-link to="/ff14_autoshengchan">
          <a-card hoverable class="menu_card icon">
            <img src="./assets/img/blacksmith.png" class="logo" />
          </a-card>
        </router-link>
        <div class="card_font">
          <p style="margin: -30px 0 0 7px; font-size: 16px">自动生产</p>
        </div>
      </div>

      <router-view></router-view>
      <div class="toolbar">
        <a-tooltip title="上一级">
          <a-button class="submit" type="dashed" shape="circle">
            <LeftOutlined style="font-size: 29px" @click="$router.go(-1)" />
          </a-button>
        </a-tooltip>
        <a-tooltip title="帮帮忙">
          <a-button class="submit" type="dashed" shape="circle" @click="tour_open = true">
            <QuestionOutlined style="font-size: 29px" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
  </div>
  <a-tour :open="tour_open" :steps="steps" @close="tour_open = false" />
</template>

<style scoped>
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
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 60%;
  margin-left: 28px;
}
.logo {
  height: 100px;
  width: 100px;
  margin: -12px 0 0 -12px;
  filter: grayscale(150%) brightness(200%);
}
</style>
