<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}?`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer v-model="drawer">
      <!-- 标题部分 -->
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              >{{ item.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              >{{ item.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>

    <!-- 添加 SKU 更新的对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="更新SKU"
      width="80%"
      :before-close="handleClose"
    >
      <SkuForm ref="skuForm" @whileCancel="handleCancel" />
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
//引入请求
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from "@/api/product/sku";
//引入ts类型
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from "@/api/product/sku/type";
import { ElMessage } from "element-plus";
//引入sku表单组件
import SkuForm from '@/views/product/spu/SkuFrom.vue';

//分页器当前页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(10);
let total = ref<number>(0);
let skuArr = ref<SkuData[]>([]);
//控制抽屉显示与隐藏的字段
let drawer = ref<boolean>(false);
let skuInfo = ref<any>({});
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
//sku表单组件实例
let skuForm = ref();

//组件挂载完毕
onMounted(() => {
  getHasSku();
});
const getHasSku = async (pager = 1) => {
  //当前分页器的页码
  pageNo.value = pager;
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  if (result.code == 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }
};
//分页器下拉菜单发生变化触发
const handler = (pageSizes: number) => {
  getHasSku();
};

//商品的上架与下架的操作
const updateSale = async (row: SkuData) => {
  //如果当前商品的isSale==1,说明当前商品是上架的额状态->更新为下架
  //否则else情况与上面情况相反
  if (row.isSale == 1) {
    //下架操作
    await reqCancelSale(row.id as number);
    ElMessage({ type: "success", message: "下架成功" });
    getHasSku(pageNo.value);
  } else {
    //下架操作
    await reqSaleSku(row.id as number);
    ElMessage({ type: "success", message: "上架成功" });
    getHasSku(pageNo.value);
  }
};
//更新已有的SKU
const updateSku = async (row: SkuData) => {
  dialogVisible.value = true;
  //等待下一次DOM更新完成
  await nextTick();
  //获取SKU详情
  const result = await reqSkuInfo(row.id as number);
  if (result.code === 200) {
    const skuData: SkuData = result.data;
    //初始化表单数据
    skuForm.value.initSkuData(
      skuData.category1Id,
      skuData.category2Id,
      {
        category3Id: skuData.category3Id,
        id: skuData.spuId,
        tmId: skuData.tmId
      },
      skuData.id
    );
  }
};
//查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true;
  //获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number);
  //存储已有的SKU
  skuInfo.value = result.data;
};
//删除某一个已有的商品
const removeSku = async (id: number) => {
  let result: any = await reqRemoveSku(id);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasSku(pageNo.value > 1 ? pageNo.value -1 : pageNo.value);
  } else {
    //删除失败
    ElMessage({ type: "error", message: "系统数据不能删除" });
  }
};

//处理对话框关闭
const handleClose = (done: () => void) => {
  done();
};

//处理取消操作
const handleCancel = (type: number) => {
  dialogVisible.value = false;
  //重新获取列表数据
  if (type === 0) {
    getHasSku(pageNo.value);
  }
};
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
