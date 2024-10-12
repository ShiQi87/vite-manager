<script setup lang='ts'>
import { onMounted } from 'vue';
import useUserStore from '@/store/module/user';
let userStore = useUserStore();
onMounted(() => {
  userStore.userInfo();
});
</script>

<template>
</template>

<style lang='scss' scoped>

</style>
