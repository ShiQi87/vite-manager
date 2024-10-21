<script setup lang="ts">
import { ref } from "vue";
let progressRef = ref();
let length = 0;
let timer = ref();

const open = () => {
  progressRef.value.style.display = "block";
  timer.value = requestAnimationFrame(function fn() {
    //requestAnimationFrame是一个请求动画的方法，返回值是long类型的唯一标识，用于cancel清除
    if (length < 99) {
      progressRef.value.style.width = length + "%";
      length++;
      timer.value = requestAnimationFrame(fn); //递归实现进度条增长
    } else {
      cancelAnimationFrame(timer.value); //到达一百取消动画请求
      setTimeout(() => {
        length = 100;
        progressRef.value.style.width = length + "%";
        close();
      }, 300);
    }
  });
};

const close = () => {
  length = 0;
  progressRef.value.style.width = length + "%";
  progressRef.value.style.display = "none";
};

defineExpose({
  open,
  close,
});
</script>

<template>
  <!-- ref把dom实例传送给vue -->
  <div class="progress" ref="progressRef"></div>
</template>

<style lang="scss" scoped>
.progress {
  width: 0%;
  height: 4px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  background-image: linear-gradient(skyblue, blue);
  transition: all 0.3s;
}
</style>
