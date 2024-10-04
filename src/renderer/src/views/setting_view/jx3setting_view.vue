<script>
import { SaveOutlined, CloudOutlined, SendOutlined, LeftOutlined, QuestionOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { Vue3Lottie } from 'vue3-lottie'
import done from './lottie/done.json'

export default {
  components: { QuestionOutlined, LeftOutlined, Vue3Lottie, SaveOutlined, CloudOutlined, SendOutlined },
  data() {
    return {
      done,
      config: '',
      config_bak: '',
      register_loading: false,
      check_loading: false,
      is_register_loading: false,
      is_check_loading: false,
      is_helploading: false,
      is_saveloading: false,
      is_save: '',
      save_open: false,
      help_open: false,
      // tour
      tour_open: false,
      steps: [
        {
          title: 'JX3设定',
          description: '这里是JX3相关设定页面',
        },
        {
          title: 'SeasunGame文件夹',
          description: '我们需要指定文件夹路径来自动获取你的角色等信息（一般这里会自动获取，除非不是一般情况）',
        },
        {
          title: '自定义备份文件目录',
          description: '这里是用来存放使用备份产出的".jx3bak"文件的存放位置，如果没有指定那大概是被程序自动丢到了C盘根目录',
        },
        {
          title: '云同步账号',
          description: '用来作为数据云同步功能的个人信息识别账户，功能激情开发(摸鱼打狒)中！',
        },
      ]
    }
  },
  mounted() {
    this.ipc_get_config()
  },
  // 监听路由离开
  beforeRouteLeave(to, from, next) {
    if (this.deepEqual(this.config, this.config_bak)) {
      next()
    }else {
      this.save_open = true
    }
  },
  methods: {
    ////工具
    //检查两段json是否一致
    deepEqual(obj1, obj2) {
      // 首先检查两个参数是否都是对象，并且它们的类型是否相同
      if (obj1 === obj2) {
        return true;
      }
      // 检查它们是否为null、数组或原始类型（字符串、数字、布尔值等）
      if (obj1 == null || typeof obj1 !== 'object' ||
        obj2 == null || typeof obj2 !== 'object') {
        return false;
      }
      // 检查它们的构造函数是否相同（例如，Array与Array，Object与Object）
      let obj1Type = Object.prototype.toString.call(obj1);
      let obj2Type = Object.prototype.toString.call(obj2);
      if (obj1Type !== obj2Type) {
        return false;
      }
      // 如果它们都是数组，则逐个比较它们的元素
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
          return false;
        }
        for (let i = 0; i < obj1.length; i++) {
          if (!this.deepEqual(obj1[i], obj2[i])) {
            return false;
          }
        }
        return true;
      }
      // 如果它们都是对象，则逐个比较它们的属性
      let obj1Keys = Object.keys(obj1);
      let obj2Keys = Object.keys(obj2);
      if (obj1Keys.length !== obj2Keys.length) {
        return false;
      }
      for (let key of obj1Keys) {
        if (!obj2Keys.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
      }
      return true;
    },

    ////应用

    async ipc_get_config() {
      this.config = await window.electron.ipcRenderer.invoke('get_config')
      this.config_bak = await window.electron.ipcRenderer.invoke('get_config')
    },
    async ipc_put_config() {
      await window.electron.ipcRenderer.invoke('put_config', {
        jx3_path: this.config.jx3_path,
        jx3_backup_path: this.config.jx3_backup_path
      })
      message.success('保存设置成功！', 3)
      this.config_bak = await window.electron.ipcRenderer.invoke('get_config')
    },
    click() {
      this.register_loading = true
      setTimeout(() => {
        this.is_register_loading = true
      }, 3000)
    },
    skip_save() {
      this.config_bak = this.config
      this.$router.push('/setting/ff14setting')
    }
  }
}
</script>

<template>
  <a-modal v-model:open="help_open" title="Title" :confirm-loading="is_helploading" >
    <p>这是帮助文档窗口</p>
  </a-modal>
  <a-modal v-model:open="save_open" title="请确认！" :confirm-loading="is_saveloading" @ok="skip_save">
    <p>有选项已被修改但是未被保存，确认离开设定吗？</p>
  </a-modal>

  <div class="setting_list">
    <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
      <div class="antitext" style="padding-top: 3px">SeasunGame文件夹目录：</div>
      <a-input v-model:value="config.jx3_path" style="width: 480px; height: 26px"></a-input>
    </div>
  </div>
  <div class="setting_list">
    <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
      <div class="antitext" style="padding-top: 3px">自定义备份文件目录：</div>
      <a-input v-model:value="config.jx3_backup_path" style="width: 585px; height: 26px"></a-input>
    </div>
  </div>
  <div class="setting_list" style="padding: 30px 0 0 18px; display: flex">
    <div class="antitext" style="padding-top: 3px; width: 130px">云同步账号：</div>
    <a-input-group compact style="margin-top: -2px">
      <a-input v-model:value="value" placeholder="请输入账号" style="width: 200px"></a-input>
      <a-input-password
        v-model:value="value"
        placeholder="请输入密码"
        style="width: 200px"
      ></a-input-password>
      <a-tooltip title="新用户">
        <a-button v-if="!is_register_loading" :loading="register_loading" @click="click">
          <template #icon><CloudOutlined /></template>
        </a-button>
        <a-button v-else>
          <template #icon>
            <Vue3Lottie :animation-data="done" loop="false" />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip title="检测">
        <a-button :loading="isloading">
          <template #icon><SendOutlined /></template>
        </a-button>
      </a-tooltip>
    </a-input-group>
  </div>

  <div class="toolbar">
    <a-tooltip title="上一级">
      <a-button class="submit" type="dashed" shape="circle" @click="$router.push('/menu')">
        <LeftOutlined style="font-size: 29px"/>
      </a-button>
    </a-tooltip>
    <a-tooltip title="保存">
      <a-button class="submit" type="dashed" shape="circle" @click="ipc_put_config">
        <SaveOutlined style="font-size: 29px" />
      </a-button>
    </a-tooltip>
    <a-tooltip title="帮帮忙">
      <a-button class="submit" type="dashed" shape="circle" @click="this.tour_open = true">
        <QuestionOutlined style="font-size: 29px"/>
      </a-button>
    </a-tooltip>
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
  height: 575px;
  margin-left: 27px;
}
.setting_list {
  width: 790px;
  height: 80px;
  background-color: #fde9f1;
  border-radius: 10px;
  margin: 20px 0 0 20px;
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
  margin: 140px 0 0 664px;
}
</style>
