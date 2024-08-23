<script>
import Back_btn from '../components/back_btn.vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
export default {
  components: { Back_btn, PlusOutlined, DeleteOutlined, CheckCircleOutlined },
  data() {
    return {
      isSelect: '',
      select_user: '',
      user_dir: '',
      backup_name: '',
      confirmLoading: ref(false),
      isLoading: false,
      open: false,
      userdata:[],
      userbakup:[]
    }
  },
  mounted() {
    this.find_jx3_user()
  },
  methods:{
    formatDateTime() {
      let now = new Date();
      let year = now.getFullYear();
      let month = String(now.getMonth() + 1).padStart(2, '0');
      let day = String(now.getDate()).padStart(2, '0');
      let hours = String(now.getHours()).padStart(2, '0');
      let minutes = String(now.getMinutes()).padStart(2, '0');
      let seconds = String(now.getSeconds()).padStart(2, '0');
      let Milliseconds = String(now.getMilliseconds()).padStart(2, '0');

      return `${year}${month}${day}${hours}${minutes}${seconds}${Milliseconds}`;
    },
    async get_username_list() {
      let username = []
      for (const data of this.userdata) {
        username.push(data.username)
      }
      const res = await window.electron.ipcRenderer.invoke('read_jx3_user_backup', {username: username})
      console.log(res)
    },
    async find_jx3_user() {
      this.isLoading = true
      const data = await window.electron.ipcRenderer.invoke('find_jx3_user')
      if ( data.code === 1){
        this.userdata = data.msg
        this.isLoading = false
      }else {
        this.$router.go(-1)
        message.error('在使用设置的JX3游戏路径查找角色时发生错误，请确认填写的路径是否正确！', 3);
        this.isLoading = false
      }
      // await this.get_username_list()
    },
    async click_user(user) {
      this.isLoading = true
      this.isSelect = user
      const bak_path = await window.electron.ipcRenderer.invoke('get_config')
      const res = await window.electron.ipcRenderer.invoke('search_jx3_user_data', {
        dir: bak_path.jx3_backup_path + '\\' + user.username + '@' + user.area[1],
        keywords: user.username + '@' + user.area[1]
      })
      if (res.code === 1) {
        this.userbakup = res.msg
      }else {
        message.error(res.msg, 3);
      }
      this.isLoading = false
    },
    async click_add_user_data() {
      this.isLoading = true
      const bak_path = await window.electron.ipcRenderer.invoke('get_config')
      const res = await window.electron.ipcRenderer.invoke('add_jx3_user_data', {
        src_path: this.isSelect.dir,
        bak_path: bak_path.jx3_backup_path + '\\' + this.isSelect.username + '@' + this.isSelect.area[1],
        file_name: this.isSelect.username + '@' + this.isSelect.area[1] + '_' + this.formatDateTime() + '.jx3bak',
      })
      if (res.code === 1) {
        message.success('添加角色 ' + this.isSelect.username + '@' + this.isSelect.area[1] + ' 设定存档成功！', 3);
      }else {
        message.error(res.msg, 3);
      }
      await this.click_user(this.isSelect)
      this.isLoading = false
    },
    async click_delete_user_data(file) {
      this.isLoading = true
      const bak_path = await window.electron.ipcRenderer.invoke('get_config')
      const res = await window.electron.ipcRenderer.invoke('delete_jx3_user_data', {
        dir: bak_path.jx3_backup_path + '\\' + this.isSelect.username + '@' + this.isSelect.area[1],
        file_name: file,
      })
      console.log(
        {
          dir: bak_path.jx3_backup_path + '\\' + this.isSelect.username + '@' + this.isSelect.area[1],
          file_name: file,
        }
      )
      if (res.code === 1) {
        message.success('删除成功！', 3);
      }else {
        message.error('删除失败！错误：' + res.msg, 3);
      }
      await this.click_user(this.isSelect)
      this.isLoading = false
    },
    click_jx3_usedata(data){
      this.open = true;
      this.backup_name = data
    },
    async click_confirm(user) {
      this.confirmLoading = true
      let username = ''
      for (const data of this.userdata) {
        if (data.username === user) {
          this.user_dir = data.dir
          username = data.username + '@' + data.area[1]
        }
      }
      const res = await window.electron.ipcRenderer.invoke('use_jx3_user_data', {
        dir: this.user_dir,
        name: this.backup_name,
        folder:this.backup_name.split('_')[0]
      })
      if ( res.code === 1){
        message.success('应用角色 ' + this.backup_name.split('_')[0] + ' 的数据到角色 ' + username + ' 成功！', 3)
      }else {
        message.error(res.msg, 3);
      }
      this.confirmLoading = false
      this.open = false
    }
  }
}
</script>

<template>
  <div class="loading" v-show="isLoading">
    <div class="loading_bak">
      <div class="loading_gif">
        <img src="../assets/loading/dog_loading.svg">
      </div>
      <div class="loading_font">正在加载中...</div>
    </div>
  </div>

  <div class="find_jx3_user">
    <div class="btn_back">
      <Back_btn></Back_btn>
    </div>
    <div class="user_list">
      <a-card v-for="user in userdata" :class="{ 'dynamite': isSelect === user}" :key="user" hoverable class="user" @click="click_user(user)">
        <div style="font-size: 20px">{{ user.username + '·' + user.area[1] }}</div>
      </a-card>
    </div>
    <div v-if="isSelect" class="user_data">
      <a-card v-for="data in userbakup" :key="data" hoverable class="data">
        <div style="font-size: 16px; margin-left: -20px; margin-top: -20px">{{ data.split('.')[0].split('_')[0]}}</div>
        <div style="display: flex;margin-left: -20px;margin-top: 10px">
          <div style="font-size: 14px;white-space: nowrap;">创建时间:{{ data.split('.')[0].split('_')[1]}}</div>
          <a-tooltip title="应用">
            <a-button style="margin-left: 80px; margin-right: 10px" type="dashed" shape="circle" @click="click_jx3_usedata(data)">
              <CheckCircleOutlined style="font-size: 22px"/>
            </a-button>
          </a-tooltip>
          <a-tooltip title="删除">
            <a-button type="dashed" shape="circle" @click="click_delete_user_data(data)">
              <DeleteOutlined style="font-size: 22px"/>
            </a-button>
          </a-tooltip>
        </div>
      </a-card>
      <a-card class="data" hoverable @click="click_add_user_data()">
        <div style="font-size: 36px;display: flex;justify-content: center;">
          <PlusOutlined />
        </div>
      </a-card>
    </div>
    <a-modal v-model:open="open" style="width: 500px;" title="请选择应用本键位设置的角色" :confirm-loading="confirmLoading" cancelText="取消" okText="应用" @ok="click_confirm(select_user)">
      <a-select
        ref="select"
        v-model:value="select_user"
        style="width: 200px"
      >
        <a-select-option v-for="user in userdata" :key="user" :value="user.username">{{ user.username }}</a-select-option>
      </a-select>
    </a-modal>
  </div>

</template>

<style scoped>
/* 滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px; /* 滚动条宽度 */
  height: 12px; /* 垂直滚动条的高度 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: #cef3ee; /* 滑块颜色 */
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
.find_jx3_user {
  padding-top: 5%;
  padding-left: 1%;
  display: flex;
}
.loading_bak {
  position: absolute;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: #515151;
  opacity: 0.5;
}
.loading_gif {
  display: flex;
  justify-content: center;
  margin-top: 30%;
}
.loading_font {
  color: white;
  display: flex;
  justify-content: center;
}
.user {
  display: block;
  background-color: white;
  border-radius: 5px;
  margin: 15px 40px;
  border: 3px solid #ffe7c7;
  padding: 10px;
  width: 300px;
  height: 100px;
  transition: color 0.3s ease;
}
.data {
  display: block;
  background-color: white;
  border-radius: 5px;
  margin: 15px 40px;
  border: 3px solid #ffe7c7;
  padding: 10px;
  width: 380px;
  height: 100px;
  transition: color 0.3s ease;
}
.user_list {
  width: 400px;
  height: 575px;
  overflow: auto;
}
.user_data {
  margin-left: -30px;
  background-color: rgba(255, 250, 249, 0.76);
  border-radius: 10px;
  width: 460px;
  height: 575px;
  overflow: auto;
}
.btn_back {
  width: 36px;
  height: 36px;
}
.dynamite {
  background-color: #fde9f1;
  border: 5px solid #e3ffd6;
}
</style>
