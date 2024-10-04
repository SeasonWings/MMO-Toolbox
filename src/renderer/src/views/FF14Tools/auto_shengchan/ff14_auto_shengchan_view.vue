<script>
import {
  LeftOutlined,
  QuestionOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { createVNode } from 'vue'
export default {
  components: {
    QuestionOutlined,
    LeftOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined,
    DeleteOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
  },
  data() {
    return {
      always_top: false, // 置顶状态
      start: false,
      keystr: '',
      count: 0,
      time:{
        marco_time: 0,
        all_marco_time: 0,
        now_time: 0,
        now_loop: 0
      },
      MarcoKey: {
        id: 0,
        MarcoDelay: 0,
        key: '',
        keyCode: ''
      },
      Config: {
        Marco: [],
        EntryKey: {
          key: '',
          keyCode: ''
        },
        runningDelay: 0,
        loop: 0
      },
      listeningForKeyPress: false, // 是否正在监听键盘事件
      // tour
      tour_open: false,
      steps: [
        {
          title: '宏按键设置',
          description: '添加希望运行的宏所在的快捷键并指定运行时间后，点击"+"按钮添加至宏序列',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step1.png',
          }),
        },
        {
          title: '宏序列',
          description: '添加的宏会显示在宏序列中，自左到右代表宏按键执行顺序及各阶段所需时间',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step2.png',
          }),
        },
        {
          title: '其他按键设置',
          description: '如图所示添加确认按键(手柄模式的确认键),宏间隔(两个生产宏的中间缓存时间)以及运行次数',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step3.png',
          }),
        },
        {
          title: '工具栏',
          description: '控制工具启停,从左到右依次为"开启/停止","置顶窗口/取消置顶","帮助"',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step4.png',
          }),
        },
        {
          title: '执行进度',
          description: '在开启宏序列后可以看到当前整体运行进度和单个宏运行进度',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step5.png',
          }),
        },
        {
          title: '如何使用',
          description: '设定好上述键位及宏序列后，点击启动，随后返回游戏内点击框选区域然后AFK开始玩手机即可（如果你设置的没问题的话，嗯！',
          cover: createVNode('img', {
            src: 'https://picgo-1304444558.cos.ap-nanjing.myqcloud.com/HoneyB/shengchan/step6.png',
          }),
        },
      ],
    }
  },
  mounted() {
    this.get_config()
  },
  unmounted() {
    window.electron.ipcRenderer.invoke('cancel_on_top')
  },
  methods: {
    async click_top() {
      await window.electron.ipcRenderer.invoke('toggle_on_top')
      this.always_top = !this.always_top
    },
    click_add_marco() {
      this.MarcoKey.id = this.count++
      let json = this.MarcoKey
      this.Config.Marco.push(json)
      this.put_config()
      this.MarcoKey = {
        id: 0,
        MarcoDelay: 0,
        key: '',
        keyCode: ''
      }
    },
    async get_config() {
      this.Config = await window.electron.ipcRenderer.invoke('get_json', {
        name: 'ff14_shengchan.json'
      })
    },
    async put_config() {
      let list = []
      for (const item of this.Config.Marco) {
        let data = {
          id: item.id,
          MarcoDelay: item.MarcoDelay,
          key: item.key,
          keyCode: item.keyCode
        }
        list.push(data)
      }
      let cfg = {
        Marco: list,
        EntryKey: { key: this.Config.EntryKey.key, keyCode: this.Config.EntryKey.keyCode },
        runningDelay: this.Config.runningDelay,
        loop: this.Config.loop
      }
      await window.electron.ipcRenderer.invoke('put_json', {
        name: 'ff14_shengchan.json',
        json: cfg
      })
    },
    async click_start() {
      this.start = true
      this.time.marco_time = Math.floor(this.calculate_marco_time())
      this.time.all_marco_time = Math.floor(this.calculate_marco_time()) * this.Config.loop
      this.time.now_time = 0
      this.time.now_loop = 0
      clearInterval(this.marco_time)

      for (let i = 5; i > 0; i--) {
        message.info(i, 1)
        await this.delay(1000)
      }
      message.info('GO!', 1)

      this.loop = setInterval(async () => {

        if (this.time.now_loop === this.Config.loop) {
          clearInterval(this.loop);
        }
      }, this.calculate_marco_time() * 1000);

      for (let i = 0; i < this.Config.loop  && this.start; i++) {
        this.time.now_time = 0
        this.marco_time = setInterval(() => {
          this.time.now_time++;
        }, 1000);
        await window.electron.ipcRenderer.invoke('ff14_auto_shengchan')
        clearInterval(this.marco_time);
        this.time.now_loop++
      }

      this.start = false
    },

    calculate_marco_time(){
      let time = 4
      for (let item of this.Config.Marco) {
        time += (item.MarcoDelay + this.Config.runningDelay + 0.6)
      }
      time += this.Config.runningDelay
      return time
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    // 按下获取键码
    promptForKeyPress(str) {
      this.keystr = str
      if (!this.listeningForKeyPress) {
        this.listeningForKeyPress = true
        message.info('请在5s内按下目标按键')
        // 添加全局键盘事件监听器
        window.addEventListener('keydown', this.handleKeyPress)
        // 如果用户没有在合理的时间内按键，监听器将被移除
        setTimeout(() => {
          if (this.listeningForKeyPress) {
            this.stopListeningForKeyPress()
            message.warning('按键检测超时！请重试')
          }
        }, 5000) // 5秒后自动停止监听
      }
    },
    handleKeyPress(event) {
      // 存储键码并停止监听
      if (this.keystr === 'MarcoKey') {
        this.MarcoKey.key = event.key
        this.MarcoKey.keyCode = event.which
      } else if (this.keystr === 'EntryKey') {
        this.Config.EntryKey.key = event.key
        this.Config.EntryKey.keyCode = event.keyCode || event.which
      }
      this.stopListeningForKeyPress()
      this.put_config()
      message.success(`记录按键: ${event.key} (VK Code: ${event.keyCode || event.which})`)
    },
    stopListeningForKeyPress() {
      // 移除全局键盘事件监听器
      window.removeEventListener('keydown', this.handleKeyPress)
      this.listeningForKeyPress = false
    },
    // 删list
    removeById(array, id) {
      return array.filter((item) => item.id !== id)
    },
    removeElement(id) {
      this.Config.Marco = this.removeById(this.Config.Marco, id)
      this.put_config()
    },

  },
}
</script>

<template>
  <audio ref="loop" src="/assets/FFXIV_Limit_Break_Charged.mp3" autoplay type="audio/mpeg"></audio>
  <audio ref="end" src="/assets/FFXIV_Limit_Break_Charged.mp3" type="audio/mpeg"></audio>
  <div class="auto_shengchan">
    <div class="setting_bak">
      <div class="setting_list" style="height: 240px; padding-top: 20px">
        <div style="display: flex">
          <div class="input_area" style="margin: 0 0 0 20px">
            <div class="antitext" style="padding-top: 3px; font-size: 16px; margin-left: 20px">
              宏按键:
            </div>
            <a-input
              ref="ref1"
              v-model:value="MarcoKey.key"
              style="width: 40px; height: 28px"
              readonly="true"
              @click="promptForKeyPress('MarcoKey')"
            ></a-input>

            <div class="antitext" style="padding-top: 3px; font-size: 16px; margin-left: 20px">
              宏时间(s):
            </div>
            <a-input-number
              v-model:value="MarcoKey.MarcoDelay"
              style="width: 50px; height: 28px"
            ></a-input-number>

            <a-tooltip title="添加至宏队列">
              <a-button
                class="submit"
                style="margin-left: 20px"
                type="dashed"
                shape="circle"
                @click="click_add_marco"
              >
                <div style="margin: -10px 0 0 0; font-size: 30px">+</div>
              </a-button>
            </a-tooltip>
          </div>

          <div class="input_area" style="margin: 0 0 0 10px; width: 400px">
            <div class="antitext" style="padding-top: 3px; font-size: 16px; margin-left: 15px">
              确认按键:
            </div>
            <a-input
              v-model:value="Config.EntryKey.key"
              style="width: 40px; height: 28px"
              readonly="true"
              @click="promptForKeyPress('EntryKey')"
            ></a-input>

            <div class="antitext" style="padding-top: 3px; font-size: 16px; margin-left: 10px">
              宏间隔(s):
            </div>
            <a-input-number
              v-model:value="Config.runningDelay"
              style="width: 50px; height: 28px"
              @change="put_config"
            ></a-input-number>

            <div class="antitext" style="padding-top: 3px; font-size: 16px; margin-left: 10px">
              运行次数:
            </div>
            <a-input-number
              v-model:value="Config.loop"
              style="width: 50px; height: 28px"
              @change="put_config"
            ></a-input-number>
          </div>
        </div>
        <div v-if="Config.Marco.length > 0">
          <div class="antitext" style="margin: 20px 0 0 25px">设定的宏序列:</div>
          <div class="marco_list antitext">
            <div class="input_area" style="margin: 5px 0 0 20px; height: 40px; width: 80px">
              <div style="margin: 0 auto 0 auto">START</div>
            </div>
            <div
              v-for="sub_marco in Config.Marco"
              :key="sub_marco"
              class="antitext"
              style="display: flex"
            >
              <div style="display: block; width: 54px">
                <div style="margin: 15px 0 0 5px; font-size: 12px">
                  间隔 {{ Config.runningDelay }} s
                </div>
                <div style="margin: -8px 0 0 5px; font-size: 24px">---></div>
              </div>
              <div class="input_area" style="margin: 5px 0 0 5px; height: 40px; width: 160px">
                <div style="margin: 0 auto 0 auto">
                  按下 {{ sub_marco.key }} 键,运行 {{ sub_marco.MarcoDelay }} s
                </div>
                <a-tooltip style="margin: 0 8px 0 0" title="删除">
                  <DeleteOutlined
                    style="font-size: 12px; margin: 0 8px 0 0"
                    @click="removeElement(sub_marco.id)"
                  />
                </a-tooltip>
              </div>
            </div>
            <div class="antitext" style="display: flex">
              <div style="display: block; width: 54px">
                <div style="margin: 15px 0 0 5px; font-size: 12px">
                  间隔 {{ Config.runningDelay }} s
                </div>
                <div style="margin: -8px 0 0 5px; font-size: 24px">---></div>
              </div>
              <div class="input_area" style="margin: 5px 0 0 5px; height: 40px; width: 60px">
                <div style="margin: 0 auto 0 auto">END</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="antitext" style="margin: 20px 0 0 25px">当前暂无设定的宏序列</div>
        </div>
      </div>
      <a-divider />
      <div style="display: flex; flex-direction: column; margin: 0 0 0 20px">
        <div>宏运行进度:{{this.time.now_loop}}/{{this.Config.loop}}(次)</div>
        <a-progress :percent="this.time.now_loop/this.Config.loop* 100" :size="[300, 20]" style="width: 600px"/>
        <div>宏运行时间:{{this.time.now_time}}/{{this.time.marco_time}}(S)</div>
        <a-progress :percent="this.time.now_time/this.time.marco_time* 100" :size="[300, 20]" style="width: 600px"/>
      </div>

      <router-view></router-view>
    </div>

    <div class="toolbar">
      <a-tooltip title="上一级">
        <a-button class="submit" type="dashed" shape="circle" @click="$router.go(-1)">
          <LeftOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
      <a-tooltip v-if="!start" title="开始">
        <a-button class="submit" type="dashed" shape="circle" @click="click_start">
          <PlayCircleOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
      <a-tooltip v-else title="停止">
        <a-button class="submit" type="dashed" shape="circle" @click="start = false">
          <PauseCircleOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
      <a-tooltip v-if="!always_top" title="置顶窗口">
        <a-button class="submit" type="dashed" shape="circle" @click="click_top">
          <VerticalAlignTopOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
      <a-tooltip v-else title="取消置顶">
        <a-button class="submit" type="dashed" shape="circle" @click="click_top">
          <VerticalAlignBottomOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
      <a-tooltip title="帮帮忙">
        <a-button class="submit" type="dashed" shape="circle" @click="this.tour_open = true">
          <QuestionOutlined style="font-size: 29px" />
        </a-button>
      </a-tooltip>
    </div>
  </div>

  <a-tour
    :open="tour_open"
    :steps="steps"
    @close="this.tour_open = false"
  />

</template>

<style scoped>
.auto_shengchan {
  padding-top: 5%;
  padding-left: 1%;
  display: flex;
}
.setting_bak {
  background-color: white;
  border-radius: 10px;
  width: 830px;
  height: 570px;
  margin-left: 27px;
}
.setting_list {
  width: 790px;
  height: 80px;
  background-color: #fde9f1;
  border-radius: 10px;
  margin: 20px 0 0 20px;
}
.input_area {
  display: flex;
  background: #ffffff;
  border-radius: 10px;
  width: 340px;
  height: 100px;
  justify-content: flex-start;
  align-items: center;
}
.marco_list {
  display: flex;
  align-items: center;
  width: 790px;
  height: 85px;
  overflow: auto;
}

/*工具栏部分*/
.submit {
  width: 40px;
  height: 40px;
  margin: 5px;
}
.toolbar {
  position: fixed;
  border-radius: 25px;
  margin: 500px 0 0 650px;
}

/* 滑块样式 */
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 0; /* 滚动条宽度 */
  height: 10px; /* 垂直滚动条的高度 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: #acfffa; /* 滑块颜色 */
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
  background-color: #dafafb; /* 鼠标悬停时的颜色 */
}
</style>
