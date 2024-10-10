<script setup lang='ts'>
import { ElMenuItem, ElSubMenu, ElIcon } from 'element-plus';
import { useRouter } from 'vue-router'

let prop = defineProps(['menuList']);
const procMenu = prop.menuList.filter(item => item.meta.hidden === false);

let $router = useRouter();

const goRoute = (component: any) => {
  $router.push(component.index);
}
</script>

<template>
  <div>
      <template v-for="item in procMenu" :key="item.path">
        <el-menu-item v-if="!item.children" :index="item.path" @click="goRoute"> 
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
            <template #title>
                <span>{{ item.meta.title }}</span>
            </template>
        </el-menu-item>
        <el-sub-menu v-else-if="item.children" :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            {{ item.meta.title }} 
          </template>
          <my-menu :menuList="item.children" />
        </el-sub-menu>
      </template>
  </div>
</template>

<style lang='scss' scoped>

</style>
