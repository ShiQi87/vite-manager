<script setup lang="ts">
import { reactive, ref, watch, nextTick, onBeforeUnmount } from "vue";
import useCategoryStore from "@/store/module/category";
import { reqAddOrUpdateAttr, reqAttr, reqDeleteAttr } from "@/api/product/attr";
import {
  AttrData,
  AttrResponse,
  Attrs,
  AttrValue,
} from "@/api/product/attr/type";
import { ElMessage } from "element-plus";

let attrArr = ref<Attrs>();
let attrParams = reactive<AttrData>({
  attrName: "", //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: "", //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
});
let show = ref<boolean>(true);
let inputRef = ref();

const categoryStore = useCategoryStore();

//监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    attrArr.value = [];
    if (!categoryStore.c3Id) return;
    getAttrArr();
  }
);

//获取属性数组
const getAttrArr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  const result: AttrResponse = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code == 200) {
    attrArr.value = result.data;
  }
};

//保存按钮的回调
const save = async () => {
  const result = await reqAddOrUpdateAttr(attrParams);
  if (result.code == 200) {
    show.value = !show.value;
    ElMessage({
      type: "success",
      message: attrParams.id ? "修改成功" : "添加成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: attrParams.id ? "修改失败" : "添加失败",
    });
  }
  getAttrArr();
};

const cancel = () => {
  show.value = !show.value;
  getAttrArr();
};
const edit = (item: AttrData) => {
  show.value = !show.value;
  Object.assign(attrParams, item);
};

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: "",
    flag: true,
  });
  nextTick(() => {
    inputRef.value.focus();
  });
};

const addAttr = () => {
  Object.assign(attrParams, {
    attrName: "", //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: categoryStore.c3Id, //把三级菜单id传送给attr
    categoryLevel: 3, //代表的是三级分类
    id: "",
  });
  show.value = !show.value;
};

const showDiv = (row: AttrValue, $index: number) => {
  //判空
  if (!row.valueName.trim()) {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: "warning",
      message: "输入不能为空",
    });
    return;
  }
  //判重
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      //引用类型只有地址相同才相同
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: "warning",
      message: "输入不能为空",
    });
    return;
  }
  row.flag = false;
};

const showInput = (row: AttrValue) => {
  row.flag = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const deleteAttrValue = ($index: number) => {
  attrParams.attrValueList.splice($index, 1);
};

const deleteAttr = async (attrId: number) => {
  const result = await reqDeleteAttr(attrId);
  if ((result.code == 200)) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
  getAttrArr();
};

onBeforeUnmount(() => {
  categoryStore.$reset();
})
</script>

<template>
  <div>
    <Category />
    <el-card style="margin: 10px 0">
      <div v-show="show">
        <el-button
          type="primary"
          icon="Plus"
          @click="addAttr"
          :disabled="!categoryStore.c3Id"
          >添加属性</el-button
        >
        <el-table border :data="attrArr" style="margin-top: 20px">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="200px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin-left: 10px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template #="{ row, $index }">
              <el-button
                type="warning"
                icon="Edit"
                size="default"
                @click="edit(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除${row.attrName}?`"
                width="250px"
                icon="Delete"
                @confirm="deleteAttr(row.id)"
                ><template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="default"
                  ></el-button></template
              ></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="show == false">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          icon="Plus"
          type="primary"
          :disabled="!attrParams.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-table border :data="attrParams.attrValueList">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="showDiv(row, $index)"
                ref="inputRef"
              ></el-input>
              <div v-else @click="showInput(row)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-popconfirm
                :title="`你真的要删除${row.valueName}吗`"
                width="250px"
                icon="Delete"
                @confirm="deleteAttrValue($index)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete"></el-button></template
              ></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!(attrParams.attrValueList.length > 0)"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
