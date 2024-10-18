<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { reqbrand } from '@/api/product/brand';
import { BrandResponseData, BrandData } from '@/api/product/brand/type';

let pageNo = ref<number>(1);
let limit = ref<number>(3);
let total = ref<number>(0);
let recordList = ref<any>([]);

let getHasBrand = async () => {
  let result: BrandResponseData = await reqbrand(pageNo.value, limit.value);
  if (result.code == 200) {
    total.value = result.data.total;
    recordList.value = result.data.records;
  } else {
    return Promise.reject(new Error(result.message));
  }
}

onMounted(() => {
  getHasBrand();
});

const handleSizeChange = (newSize) => {
  limit.value = newSize;
  getHasBrand();
}

const handleCurrentChange = (newPage) => {
  pageNo.value = newPage;
  getHasBrand();
}

</script>

<template>
  <el-card class="box_card">
        <el-button type="primary" size="default" icon="plus"> 添加品牌 </el-button>
        <el-table :data="recordList" border style="margin: 10px 0px;">
          <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
          <el-table-column label="品牌名称" prop="tmName"></el-table-column>
          <el-table-column label="品牌LOGO">
            <template #="{row}">
              <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          
          <el-table-column label="品牌操作" align="center">
            <template #="{row, $index}">
              <el-button type="primary" size="small" icon="Edit" @click="">编辑</el-button>
              <el-button type="danger" size="small" icon="Delete" @click="">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
         <!-- current-page:设置当前页数
              page-size:设置每页展示数据
              page-sizes: 设置下拉菜单数据
              small: 设置是否小型分页器
              background: 设置按钮是否有背景
              layout: 调整子组件六个子组件的布局 -->
         <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true" 
         layout="prev, pager, next, jumper, ->, sizes, total" :total 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"></el-pagination>
  </el-card>
</template>

<style lang='scss' scoped>

</style>
