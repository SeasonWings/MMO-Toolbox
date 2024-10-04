<script>
import { SaveOutlined, CloudOutlined, SendOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { Vue3Lottie } from 'vue3-lottie'
import done from './lottie/done.json'

export default {
  components: { LeftOutlined, Vue3Lottie, SaveOutlined, CloudOutlined, SendOutlined },
  data() {
    return {
      done,
      config: '',
      register_loading: false,
      check_loading: false,
      is_register_loading: false,
      is_check_loading: false
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<template>
  <div class="setting_list">
    <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
      <div style="padding-top: 3px">FF14的一些設定：</div>
      <a-input v-model:value="config.jx3_path" style="width: 480px; height: 26px"></a-input>
    </div>
  </div>
  <div class="setting_list">
    <div style="padding: 30px 0 0 18px; width: 100%; display: flex">
      <div style="padding-top: 3px">FF14的一些設定：</div>
      <a-input v-model:value="config.jx3_backup_path" style="width: 585px; height: 26px"></a-input>
    </div>
  </div>
  <div class="setting_list" style="padding: 30px 0 0 18px; display: flex">
    <div style="padding-top: 3px; width: 130px">FF14的一些設定：</div>
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
  </div>
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
  margin: 140px 0 0 714px;
}
</style>
