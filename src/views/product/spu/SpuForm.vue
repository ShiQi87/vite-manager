<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  HasSaleAttr,
  SpuImg,
  SaleAttr,
  SpuData,
  Trademark,
} from "@/api/product/spu/type";
import {
  reqAddOrUpdateSpu,
  reqAllBrand,
  reqAllSaleAttr,
  reqSpuImageList,
  reqSpuSaleAttrList,
} from "@/api/product/spu";
import { ElMessage } from "element-plus";

//控制对话框的显示和隐藏
let dialogVisible = ref<boolean>(false);
//存储请求到的图片路径
let dialogImageUrl = ref<string>("");
//照片墙点击触发预览的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  //弹出对话框
  dialogVisible.value = true;
};
//照片墙删除钩子
const handleRemove = () => {};
//照片上传成功之前约束照片的钩子
const handlerUpload = (file: any) => {
  if (
    file.type == "image/png" ||
    file.type == "image/jpeg" ||
    file.type == "image/gif"
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传文件务必小于3M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传文件务必PNG|JPG|GIF",
    });
    return false;
  }
};

const cancel = () => {
  emit("whileCancel", 0);
};

let brand = ref<Trademark[]>([]);
let saleAttr = ref<HasSaleAttr[]>([]);
let spuImageList = ref<SpuImg[]>([]);
let saleAttrList = ref<SaleAttr[]>([]);
//存储已有spu对象
let spuParams = ref<SpuData>({
  category3Id: "", //收集三级分类的ID
  spuName: "", //SPU的名字
  description: "", //SPU的描述
  tmId: "", //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
});

const initHasSpuData = async (selectedSpu: SpuData) => {
  try {
    spuParams.value = selectedSpu;

    const [result1, result2, result3, result4] = await Promise.all([
      reqAllBrand(),
      reqAllSaleAttr(),
      reqSpuImageList(selectedSpu.id as number),
      reqSpuSaleAttrList(selectedSpu.id as number),
    ]);

    brand.value = result1.data;
    saleAttr.value = result2.data;
    spuImageList.value = result3.data.map((i) => ({
      name: i.imgName,
      url: i.imgUrl,
    }));
    saleAttrList.value = result4.data;
  } catch (error) {
    console.log(error);
  }
};

//计算属性用在复杂逻辑的方法上
//计算属性在数据发生变动时才会进行重新计算，数据没有变动则使用缓存
let unSelectSaleAttr = computed(() => {
  let unSelectArr = saleAttr.value.filter(
    (item) =>
      // some和every的区别是some有一个满足就返回true，没有才是false，every有一个不满足就返回false，全满足才返回true
      saleAttrList.value.every((item1) => item.attrName != item1.saleAttrName) // 有一个相同就返回false，说明有了
  );
  return unSelectArr;
});

let newSaleAttrIdandValueName = ref(""); //收集新加的属性的id和名字

//添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] =
    newSaleAttrIdandValueName.value.split(":"); // 中括号解构赋值，有点忘记了
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  };
  saleAttrList.value.push(newSaleAttr);

  newSaleAttrIdandValueName.value = "";
};

const toLook = (row: SaleAttr) => {
  row.flag = false;

  const { baseSaleAttrId, saleAttrValue } = row;

  row.spuSaleAttrValueList.push({
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue,
  });

  row.saleAttrValue = "";
};

const toEdit = (row: SaleAttr) => {
  row.saleAttrValue = "";
  row.flag = true;
};

// 保存按钮的回调
const save = async () => {
  //整理参数
  // 1.照片墙的数据
  spuParams.value.spuImageList = spuImageList.value.map((image: any) => ({
    imgName: image.name,
    url: (image.response && image.response.data) || image.url,
  }));

  spuParams.value.spuSaleAttrList = saleAttrList.value;
  try {
    let result = await reqAddOrUpdateSpu(spuParams.value as SpuData);

    // 成功
    // 通知父组件切换场景为0
    emit("whileCancel", 0);
  } catch (error) {}
};

// 添加一个新的SPU
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(spuParams.value, {
    category3Id: "", //收集三级分类的ID
    spuName: "", //SPU的名字
    description: "", //SPU的描述
    tmId: "", //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  });
  //清空照片
  spuImageList.value = [];
  //清空销售属性
  saleAttrList.value = [];
  newSaleAttrIdandValueName.value = "";
  spuParams.value.category3Id = c3Id;

  let [result1, result2] = await Promise.all([reqAllBrand(), reqAllSaleAttr()]);

  brand.value = result1.data;
  saleAttr.value = result2.data;
};

let emit = defineEmits(["whileCancel"]);
defineExpose({ initHasSpuData, initAddSpu });
</script>

<template>
  <div>
    <el-card style="margin-top: 10px">
      <el-form label-width="100px">
        <el-form-item label="spu名称">
          <el-input
            placeholder="请输入spu名称"
            v-model="spuParams.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="spu品牌">
          <el-select
            placeholder="请选择品牌"
            class="selector"
            v-model="spuParams.tmId"
          >
            <el-option
              v-for="(item, index) in brand"
              :label="item.tmName"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="spu描述">
          <el-input
            type="textarea"
            placeholder="请输入spu描述"
            v-model="spuParams.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
            -->
          <el-upload
            v-model:file-list="spuImageList"
            action="/api/admin/product/spuImage/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="handlerUpload"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img
              w-full
              :src="dialogImageUrl"
              alt="Preview Image"
              style="width: 100%; height: 100%"
            />
          </el-dialog>
        </el-form-item>
        <el-form-item label="spu销售属性">
          <el-select
            class="selector"
            :placeholder="
              unSelectSaleAttr.length
                ? `还有${unSelectSaleAttr.length}个未选择`
                : `无`
            "
            v-model="newSaleAttrIdandValueName"
          >
            <el-option
              v-for="(item, index) in unSelectSaleAttr"
              :key="item.id"
              :value="`${item.id}:${item.attrName}`"
              :label="item.attrName"
            ></el-option
          ></el-select>
          <el-button
            type="primary"
            icon="Plus"
            style="margin-left: 10px"
            :disabled="!newSaleAttrIdandValueName.length"
            @click="addSaleAttr"
            >添加销售属性</el-button
          >
          <el-table border style="margin: 10px 0" :data="saleAttrList">
            <el-table-column
              label="序号"
              type="index"
              width="80px"
              align="center"
            ></el-table-column>
            <el-table-column
              label="销售属性名"
              prop="saleAttrName"
            ></el-table-column>
            <el-table-column label="销售属性值">
              <!-- row是当前spu已有的销售属性对象 -->
              <template #="{ row, $index }">
                <el-tag
                  style="margin: 0px 5px"
                  @close="row.spuSaleAttrValueList.splice(index, 1)"
                  v-for="(item, index) in row.spuSaleAttrValueList"
                  :key="row.id"
                  class="mx-1"
                  closable
                >
                  {{ item.valueName }}
                </el-tag>
                <el-input
                  @blur="toLook(row)"
                  v-model="row.saleAttrValue"
                  v-if="row.flag == true"
                  placeholder="请你输入属性值"
                  size="small"
                  style="width: 100px"
                ></el-input>
                <el-button
                  @click="toEdit(row)"
                  v-else
                  type="success"
                  size="small"
                  icon="Plus"
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #="{ row, $index }">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="saleAttrList.splice($index, 1)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form></el-card
    >
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.selector {
  width: 30%;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
