<script setup lang="ts">
import Category from "@/components/Category.vue";
import { ref, watch } from "vue";
import { reqHasSpu } from "@/api/product/spu";
import useCategoryStore from "@/store/module/category";

let category = useCategoryStore();
let spuList = ref([]);

const getSpu = async () => {
  const result = await reqHasSpu(1, 3, category.c3Id);
  if (result.code == 200) {
    spuList.value = result.data;
  }
}

watch(() => category.c3Id, () => {
  getSpu();
});

let pageNo = ref<number>(1);
let limit = ref<number>(3);
</script>

<template>
  <div>
    <Category />
    <el-card style="margin-top: 10px">
      <el-button type="primary" icon="plus">添加spu</el-button>
      <el-table border :data="spuList.records">
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="spu名称" prop="spuName"></el-table-column>
        <el-table-column label="spu描述"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button></el-button>
            <el-button></el-button>
            <el-button></el-button>
            <el-button></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="spuList.total"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
      ></el-pagination>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
