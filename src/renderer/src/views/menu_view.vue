<script>
import { message } from 'ant-design-vue'
import { SettingOutlined, QuestionOutlined } from '@ant-design/icons-vue'

export default {
  components: { SettingOutlined, QuestionOutlined },
  data() {
    return {
      open: false,
      isLoading: false,
      // tour
      tour_open: false,
      steps: [
        {
          title: '如你所见',
          description: '这里只是单纯的选择游戏分类，右下角为工具栏，包含设定和帮助等',
        }
      ]
    }
  },
  methods: {
    async query_jx3_path() {
      const config = await window.electron.ipcRenderer.invoke('get_config' )
      console.log(config)
      if (!config.jx3_path){
        const jx3_reg_path = await window.electron.ipcRenderer.invoke('query_jx3_path')
        if (jx3_reg_path.code === 1){
          await window.electron.ipcRenderer.invoke('put_config', {
            jx3_path: jx3_reg_path.msg.split('SeasunGame')[0] + "SeasunGame",
            jx3_backup_path: config.jx3_backup_path,
          })
          message.success('获取JX3游戏目录成功', 2);
        }else {
          message.warning('自动获取JX3游戏安装目录失败！请前往设定页手动填写路径', 3);
        }
      }
    },
  },
  mounted() {
    this.query_jx3_path()
  }
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
    <div class="menu_card_row antitext" style="padding-top: 30px">
      <div>
        <router-link to="/jx3_tools">
          <a-card hoverable class="menu_card icon">
            <img src="./setting_view/svg/jx3box_logo.svg" class="logo" />
          </a-card>
        </router-link>
        <div class="card_font">
          <p style="margin: -30px 0 0 26px; font-size: 16px;">JX3</p>
        </div>
      </div>

      <div>
        <router-link to="/ff14_tools">
          <a-card hoverable class="menu_card icon">
            <img src="./setting_view/svg/FinalFantasy_XIV_logo.svg" class="logo" />
          </a-card>
        </router-link>
        <div class="card_font">
          <p style="margin: -30px 0 0 21px; font-size: 16px;">FF14</p>
        </div>
      </div>


      <router-view></router-view>
      <div class="toolbar">
        <a-tooltip title="设定">
          <router-link to="/setting">
            <a-button class="submit" type="dashed" shape="circle">
              <SettingOutlined style="font-size: 29px"/>
            </a-button>
          </router-link>
        </a-tooltip>
        <a-tooltip title="帮帮忙">
          <a-button class="submit" type="dashed" shape="circle" @click="this.tour_open = true">
            <QuestionOutlined style="font-size: 29px"/>
          </a-button>
        </a-tooltip>
      </div>
    </div>
  </div>
  <a-tour
    :open="tour_open"
    :steps="steps"
    @close="this.tour_open = false"
  />
</template>

<style>
body {
  background-color: rgba(0, 0, 0, 0.1);
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
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 50%;
  margin-left: 28px;
}
/*工具栏部分*/
.submit {
  width: 40px;
  height: 40px;
  margin: 5px;
}
.toolbar {
  position: fixed;
  background-color: rgba(0,0,0,0.1);
  border-radius: 25px;
  margin: 515px 0 0 700px;
}

.logo {
  height: 100px;
  width: 100px;
  margin: -12px 0 0 -12px;
}
</style>
