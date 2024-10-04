<script>
import { LeftOutlined } from '@ant-design/icons-vue'
export default {
  components: { LeftOutlined },
}
</script>

<template>
  <LeftOutlined class="backbtn" @click="$router.go(-1)"/>
</template>

<style scoped>
.backbtn {
  font-size: 36px;
  color: black;
  transition: color 0.3s ease;
}

.backbtn:hover {
  font-size: 36px;
  color: #79bbff;
}
</style>
