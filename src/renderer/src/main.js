import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import Vue3Lottie from 'vue3-lottie'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  createApp(App).component(key, component)
}

createApp(App).use(router).use(ElementPlus).use(Antd).use(Vue3Lottie).mount('#app')
