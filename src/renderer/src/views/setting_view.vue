<script>
export default {
  data() {
    return {
      selectedKeys: ['1']
    }
  },
  mounted() {
    document.addEventListener('click', this.Check_SelectedKeys)
    document.addEventListener('scroll', this.Check_SelectedKeys)
    document.addEventListener('mouseover', this.Check_SelectedKeys)
    this.Check_SelectedKeys()
  },
  unmounted() {
    document.removeEventListener('click', this.Check_SelectedKeys)
    document.removeEventListener('scroll', this.Check_SelectedKeys)
    document.removeEventListener('mouseover', this.Check_SelectedKeys)
  },
  methods: {
    Check_SelectedKeys() {
      let router_end = window.location.href.split('/').pop()
      if (router_end === 'jx3setting') {
        this.selectedKeys = ['1']
      } else if (router_end === 'ff14setting') {
        this.selectedKeys = ['2']
      }
    }
  }
}
</script>

<template>
  <div class="auto_shengchan">
    <div class="setting_bak">
      <a-layout-header>
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="light"
          mode="horizontal"
          style="height: 50px; margin-top: -20px; margin-left: 10px"
        >
          <router-link to="/setting/jx3setting">
            <a-menu-item key="1" style="width: 150px">
              <div class="selected">
                <img src="./setting_view/svg/jx3box_logo.svg" class="logo" />
                <div class="antitext" style="margin: -5px 0 0 10px; color: black">JX3设定</div>
              </div>
            </a-menu-item>
          </router-link>

          <router-link to="/setting/ff14setting">
            <a-menu-item key="2" style="width: 160px" hidden="hidden">
              <div class="selected">
                <img src="./setting_view/svg/FinalFantasy_XIV_logo.svg" class="logo" />
                <div class="antitext" style="margin: -5px 0 0 10px; color: black">FF14设定</div>
              </div>
            </a-menu-item>
          </router-link>
        </a-menu>
      </a-layout-header>

      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
/*Vue动画*/
/* 离开 */
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
/* 进入 */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

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
.selected {
  display: flex;
  font-size: 20px;
  margin-left: 18px;
}
.logo {
  height: 25px;
  width: 25px;
  margin-top: 5px;
  color: black;
}
</style>
