<template>
  <div>
    <el-card style="margin-top: 10px">
      <el-form label-width="100px">
        <el-form-item label="SKU名称">
          <el-input
            placeholder="SKU名称"
            v-model="skuParams.skuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input
            placeholder="价格(元)"
            type="number"
            v-model="skuParams.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
          <el-input
            placeholder="重量(g)"
            type="number"
            v-model="skuParams.weight"
          ></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
          <el-input
            placeholder="SKU描述"
            type="textarea"
            v-model="skuParams.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form :inline="true">
            <el-form-item
              v-for="(item, index) in attrArr"
              :key="item.id"
              :label="item.attrName"
              style="margin-right: 10px; min-width: 300px;"
            >
              <el-select v-model="item.attrIdAndValueId" style="width: 100%">
                <el-option
                  :value="`${item.id}:${attrValue.id}`"
                  v-for="(attrValue, index) in item.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form :inline="true">
            <el-form-item
              :label="item.saleAttrName"
              v-for="(item, index) in saleArr"
              :key="item.id"
              style="margin-right: 10px; min-width: 300px;"
            >
              <el-select v-model="item.saleIdAndValueId" placeholder="请选择" style="width: 100%">
                <el-option
                  :value="`${item.saleAttrId}:${saleAttrValue.id}`"
                  v-for="(saleAttrValue, index) in item.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  :label="saleAttrValue.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
          <el-table border :data="imgArr" ref="table">
            <el-table-column
              type="selection"
              width="80px"
              align="center"
            ></el-table-column>
            <el-table-column label="图片">
              <template #="{ row, $index }">
                <img
                  :src="row.imgUrl"
                  alt=""
                  style="width: 100px; height: 100px"
                />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"></el-table-column>
            <el-table-column label="操作">
              <template #="{ row, $index }">
                <el-button type="primary" size="small" @click="handler(row)"
                  >设置默认</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="save"
            >保存</el-button
          >
          <el-button type="primary" size="default" @click="cancel"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入请求API
import { reqAttr } from "@/api/product/attr";
import {
  reqSpuImageList,
  reqSpuSaleAttrList,
  reqAddSku,
} from "@/api/product/spu";
import { reqUpdateSku, reqSkuInfo } from "@/api/product/sku";
import type { SkuData } from "@/api/product/spu/type";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片的数据
let imgArr = ref<any>([]);
//获取table组件实例
let table = ref<any>();
//收集SKU的参数
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据
  category3Id: "", //三级分类的ID
  spuId: "", //已有的SPU的ID
  tmId: "", //SPU品牌的ID
  //v-model收集
  skuName: "", //sku名字
  price: "", //sku价格
  weight: "", //sku重量
  skuDesc: "", //sku的描述

  skuAttrValueList: [
    //平台属性的收集
  ],
  skuSaleAttrValueList: [
    //销售属性
  ],
  skuDefaultImg: "", //sku图片地址
});
//当前子组件的方法对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
  skuId?: number
) => {
  //收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;

  // 如果有 skuId，说明是编辑模式
  if (skuId) {
    const result = await reqSkuInfo(skuId);
    if (result.code === 200) {
      // 填充表单数据
      Object.assign(skuParams, result.data);
    }
  }

  //获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
  //获取对应的销售属性
  let result1: any = await reqSpuSaleAttrList(spu.id);
  //获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id);
  //平台属性
  attrArr.value = result.data;
  //销售属性
  saleArr.value = result1.data;
  //图片
  imgArr.value = result2.data;

  // 如果是编辑模式，设置选中的值
  if (skuId) {
    // 设置平台属性的选中值
    attrArr.value.forEach((attr: any) => {
      const matchedAttr = skuParams.skuAttrValueList?.find(
        (item) => item.attrId == attr.id
      );
      if (matchedAttr) {
        attr.attrIdAndValueId = `${matchedAttr.attrId}:${matchedAttr.id}`;
      }
    });

    // 设置销售属性的选中值
    saleArr.value.forEach((sale: any) => {
      const matchedSale = skuParams.skuSaleAttrValueList?.find(
        (item) => item.saleAttrId == sale.saleAttrId
      );
      if (matchedSale) {
        sale.saleIdAndValueId = `${matchedSale.saleAttrId}:${matchedSale.id}`;
      }
    });

    // 设置默认图片
    if (skuParams.skuDefaultImg) {
      const defaultImg = imgArr.value.find(
        (img: any) => img.imgUrl === skuParams.skuDefaultImg
      );
      if (defaultImg) {
        table.value.toggleRowSelection(defaultImg, true);
      }
    }
  }
};
//取消按钮的回调
const cancel = () => {
  $emit("whileCancel", 0);
};

//设置默认图片的方法回调
const handler = (row: any) => {
  //点击的时候,全部图片的的复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false);
  });
  //选中的图片才勾选
  table.value.toggleRowSelection(row, true);
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl;
};
//对外暴露方法
defineExpose({
  initSkuData,
});

//保存按钮的方法
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(":");
      prev.push({
        attrId,
        valueId,
      });
    }
    return prev;
  }, []);
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(":");
        prev.push({
          saleAttrId,
          saleAttrValueId,
        });
      }
      return prev;
    },
    []
  );

  try {
    // 判断是新增还是更新
    const api = skuParams.id ? reqUpdateSku : reqAddSku;
    const result: any = await api(skuParams);
    
    if (result.code == 201) {
      //通知父组件切换场景为零
      $emit("whileCancel", 0);

      ElMessage({
        type: "success",
        message: `${skuParams.id ? '更新' : '添加'}SKU成功`,
      });
    } else {
      ElMessage({
        type: "error",
        message: `${skuParams.id ? '更新' : '添加'}SKU失败`,
      });
    }
  } catch (error: any) {
    ElMessage({
      type: "error",
      message: `操作失败：${error.message}`,
    });
  }
};
//自定义事件的方法
let $emit = defineEmits(["whileCancel"]);
</script>

<style scoped></style>
