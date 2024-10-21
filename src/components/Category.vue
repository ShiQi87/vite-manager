<script setup lang="ts">
import { onMounted } from "vue";
//引入分类相关的仓库
import useCategoryStore from "@/store/module/category";
let categoryStore = useCategoryStore();
//分类全局组件挂载完毕,通知仓库发请求获取一级分类的数据
onMounted(() => {
  categoryStore.c1Id = '';
  categoryStore.c2Id = '';
  categoryStore.c3Id = '';
  categoryStore.c1Attr = [];
  categoryStore.c2Attr = [];
  categoryStore.c3Attr = [];
  getC1();
});
//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1();
};
const changeC2 = () => {
  categoryStore.c3Attr = [];
  categoryStore.c2Id = '';
  categoryStore.c3Id = '';
  //通知分类仓库发请求获取二级分类的数据
  categoryStore.getC2();
};
const changeC3 = () => {
  categoryStore.c3Id = '';
  //通知分类仓库发请求获取三级分类的数据
  categoryStore.getC3();
};
</script>

<template>
  <div>
    <el-card>
      <el-form :inline="true" class="form">
        <el-form-item label="一级分类" class="drop_bar">
          <el-select v-model="categoryStore.c1Id" @change="changeC2">
            <el-option
              v-for="item in categoryStore.c1Attr"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" class="drop_bar">
          <el-select v-model="categoryStore.c2Id" @change="changeC3">
            <el-option
              v-for="item in categoryStore.c2Attr"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" class="drop_bar">
          <el-select v-model="categoryStore.c3Id">
            <el-option
              v-for="item in categoryStore.c3Attr"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  .drop_bar {
    width: 25%;
  }
}
</style>
