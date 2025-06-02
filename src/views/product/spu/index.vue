<script setup lang="ts">
import Category from "@/components/Category.vue";
import { ref, watch } from "vue";
import { reqHasSpu, reqRemoveSpu, reqSkuList } from "@/api/product/spu";
import useCategoryStore from "@/store/module/category";
import {
  Records,
  SpuResponseData,
  SpuData,
  SkuInfoData,
  SkuData,
} from "@/api/product/spu/type";
import SpuForm from "./SpuForm.vue";
import SkuFrom from "./SkuFrom.vue";

const categoryStore = useCategoryStore();
let spuArr = ref<Records>();
let total = ref<number>(0);
let pageNo = ref<number>(1);
let limit = ref<number>(3);
let show = ref<number>(0); //0基础表单，1spu，2sku
let spu = ref<any>();
let sku = ref<any>();
let skuArr = ref<SkuData[]>([]);
let visible = ref<boolean>(false);

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

const Cancel = (param: number) => {
  show.value = param;
  getSpuArr();
};

const updateSpu = (row: SpuData) => {
  show.value = 1;
  spu.value.initHasSpuData(row);
};

const deleteSpu = async (row: SpuData) => {
  const result = await reqRemoveSpu(row.id as number);
  //检验
  getSpuArr();
};
//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换场景为2
  show.value = 2;
  //调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};

//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number);
  if (result.code == 200) {
    skuArr.value = result.data;
    //对话框显示出来
    visible.value = true;
  }
};
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
                @click="addSku(row)"
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
                @click="findSku(row)"
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
    <SkuFrom ref="sku" v-show="show == 2" @whileCancel="Cancel" />
    <el-dialog v-model="visible" title="SKU列表">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
