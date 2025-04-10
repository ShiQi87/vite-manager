<script setup lang="ts">
import Category from "@/components/Category.vue";
import { ref, watch } from "vue";
import { reqHasSpu, reqRemoveSpu } from "@/api/product/spu";
import useCategoryStore from "@/store/module/category";
import { Records, SpuResponseData, SpuData } from "@/api/product/spu/type";
import SpuForm from "./SpuForm.vue";
import SkuFrom from "./SkuFrom.vue";

const categoryStore = useCategoryStore();
let spuArr = ref<Records>();
let total = ref<number>(0);
let pageNo = ref<number>(1);
let limit = ref<number>(3);
let show = ref<number>(0); //0基础表单，1spu，2sku
let spu = ref<any>();

const getSpuArr = async (pager = 1) => {
  const result: SpuResponseData = await reqHasSpu(
    pager,
    limit.value,
    categoryStore.c3Id
  );
  if (result.code == 200) {
    spuArr.value = result.data.records;
    total.value = result.data.total;
  }
};

watch(
  () => categoryStore.c3Id,
  () => {
    spuArr.value = [];
    if (!categoryStore.c3Id) {
      show.value = 0;
      return;
    }
    getSpuArr();
  }
);

const pageChange = () => {
  getSpuArr(pageNo.value);
};

const addSpu = () => {
	show.value = 1;

	spu.value.initAddSpu(categoryStore.c3Id);
};

const Cancel = (param) => {
	show.value = param;
	getSpuArr();
};

const updateSpu = (row: SpuData) => {
  show.value = 1;
  spu.value.initHasSpuData(row);
};

const deleteSpu = async (row: SpuData) => {
	const result = await reqRemoveSpu(row.id as number)
	//检验
}
</script>

<template>
  <div>
    <Category />
    <div v-show="show == 0">
      <el-card style="margin-top: 10px">
        <el-button
          type="primary"
          icon="plus"
          @click="addSpu"
          style="margin-bottom: 10px"
          :disabled="!categoryStore.c3Id"
          >添加spu</el-button
        >
        <el-table border :data="spuArr">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="spu名称" prop="spuName"></el-table-column>
          <el-table-column label="spu描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                icon="Plus"
                size="small"
                title="增加属性"
              ></el-button>
              <el-button
                type="warning"
                icon="Edit"
                size="small"
                title="编辑已有SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="View"
                size="small"
                title="查看SKU详情"
              ></el-button>
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                title="删除SPU"
								@click="deleteSpu(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total
          background
          layout="prev, pager, next, jumper, ->, sizes, total"
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 7, 9]"
          @change="pageChange"
        ></el-pagination>
      </el-card>
    </div>
    <SpuForm ref="spu" v-show="show == 1" @whileCancel="Cancel" />
    <SkuFrom v-show="show == 2" />
  </div>
</template>

<style lang="scss" scoped></style>
