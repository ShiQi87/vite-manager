<script setup lang='ts'>
</script>

<template>
  <div class="topbar_right">
    <el-button size="small" icon="Refresh" :circle="true"></el-button>
    <el-button size="small" icon="FullScreen" :circle="true"></el-button>
    <el-button size="small" icon="Setting" :circle="true"></el-button>
    <img src="/logo.png" alt="" class="tou">
    <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  </div>
</template>

<style lang='scss' scoped>
.tou {
  width: 24px;
  height: 24px;
  margin: 0 10px;
} 
.el-icon--right {
  margin-right: 20px;
}
</style>
