<script>
import Back_btn from '../components/back_btn.vue'
import { SaveOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  components: { Back_btn, SaveOutlined},
  data() {
    return {
      config: ''
    }
  },
  mounted() {
    this.ipc_get_config()
  },
  methods: {
    async ipc_get_config() {
      this.isLoading = true
      this.config = await window.electron.ipcRenderer.invoke('get_config')
      this.isLoading = false
    },
    async ipc_put_config() {
      this.isLoading = true
      console.log(this.config)
      await window.electron.ipcRenderer.invoke('put_config', {
        jx3_path:this.config.jx3_path,
        jx3_backup_path:this.config.jx3_backup_path,
      })
      this.isLoading = false
      message.success('保存设置成功！', 3);
    }
  }
}
</script>

<template>
  <div class="setting">
    <div class="btn_back">
      <Back_btn></Back_btn>
    </div>
    <div class="setting_bak">
      <div class="setting_list">
        <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
          <div style="padding-top: 3px">JX3游戏目录(SeasunGame文件夹)：</div>
          <a-input v-model:value="this.config.jx3_path" style="width: 480px; height: 26px"></a-input>
        </div>
      </div>
      <div class="setting_list">
        <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
          <div style="padding-top: 3px">自定义备份文件目录：</div>
          <a-input v-model:value="this.config.jx3_backup_path" style="width: 585px; height: 26px"></a-input>
        </div>
      </div>
      <a-tooltip title="保存">
        <a-button class="submit" type="dashed" shape="circle" @click="ipc_put_config">
          <SaveOutlined style="font-size: 30px"/>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<style scoped>
.setting {
  padding-top: 5%;
  padding-left: 1%;
  display: flex;
}
.setting_bak {
  background-color: white;
  border-radius: 10px;
  width: 830px;
  height: 575px;
}
.btn_back {
  width: 36px;
  height: 36px;
}
.setting_list {
  width: 790px;
  height: 80px;
  background-color: #fde9f1;
  border-radius: 10px;
  margin: 20px 0 0 20px;
}
.submit {
  width: 50px;
  height: 50px;
  margin: 300px 0 0 750px;
}
</style>
