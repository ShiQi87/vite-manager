<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { reqAddOrUpdateBrand, reqbrand, reqDelete } from '@/api/product/brand';
import { BrandData, BrandResponseData, Records, ResponseData } from '@/api/product/brand/type';
import { ElMessage, UploadProps } from 'element-plus';

let pageNo = ref<number>(1);
let limit = ref<number>(3);
let total = ref<number>(0);
let recordList = ref<Records>([]);
let dialogFormVisible = ref<boolean>(false);
let newBrandInfo = reactive<BrandData>({
  tmName: '',
  logoUrl: ''
});
let formRef = ref();

const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  }
  else {
    callBack(new Error('品牌名称小于两个字'));
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack();
  }
  else {
    callBack(new Error('图片未上传'));
  }
}

const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{required: true, validator: validatorLogoUrl}]
}

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

const addBrand = () => {
  dialogFormVisible.value = true;
  newBrandInfo.id = undefined;
  newBrandInfo.logoUrl = '';
  newBrandInfo.tmName = '';
}

const updateBrand = (row: BrandData) => {
  dialogFormVisible.value = true;
  Object.assign(newBrandInfo, row);
}

const deleteBrand = async (id: number) => {
  let result: ResponseData = await reqDelete(id);
    if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '商品删除成功'
    });
    getHasBrand();
  } else {
    ElMessage({
      type: 'error',
      message: '商品删除失败'
    });
  }
}

const clearEverything = () => {
  // 刚挂载不存在form组件要判断是否存在
  formRef.value?.clearValidate();
}

const cancel = () => {
  dialogFormVisible.value = false;
}

const confirm = async () => {
  await formRef.value.validate();
  let result: ResponseData = await reqAddOrUpdateBrand(newBrandInfo);
  if (result.code == 200) {
    dialogFormVisible.value = false;
    ElMessage({
      type: 'success',
      message: newBrandInfo.id? '商品修改成功' : '商品添加成功'
    });
    getHasBrand();
  } else {
    ElMessage({
      type: 'error',
      message: newBrandInfo.id? '商品修改失败' : '商品添加失败'
    });
    dialogFormVisible.value = false;
  }
}

// 图片校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      
    } else {
    ElMessage({
      type: 'error',
      message: '上传图片过大'
    });
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件应该是图片'
    });
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  newBrandInfo.logoUrl = response.data;
  formRef.value.clearValidate('logoUrl');
}
</script>

<template>
  <div>
    <el-card class="box_card">
          <el-button type="primary" size="default" icon="plus" @click="addBrand"> 添加品牌 </el-button>
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
                <el-button type="warning" size="small" icon="Edit" @click="updateBrand(row)">编辑</el-button>
                <el-popconfirm :title="`你真的要删除${row.tmName}吗`" width="250px" icon="Delete" @confirm="deleteBrand(row.id)">
                  <template #reference>
                    <el-button type="danger" size="small" icon="Delete">删除</el-button>
                  </template>
                </el-popconfirm>
                
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <!-- current-page:设置当前页数
                page-size:设置每页展示数据
                page-sizes: 设置下拉菜单数据
                small: 设置是否小型分页器
                background: 设置按钮是否有背景
                layout: 调整子组件六个子组件的布局
                自定义事件用到了双向绑定数据 -->
          <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true" 
          layout="prev, pager, next, jumper, ->, sizes, total" :total 
        @change="getHasBrand"></el-pagination>
    </el-card>
    <!-- 对话框组件 -->
     <!-- v-model控制是否隐藏
          title控制右上角标题 -->
    <el-dialog v-model="dialogFormVisible" :title="newBrandInfo.id? '修改品牌' : '添加品牌'" style="padding: 30px;" @close="clearEverything">
      <el-form :rules ref="formRef" style="width: 80%;" :model="newBrandInfo">
        <el-form-item label="品牌名称" style="margin-top: 30px;" label-width="100px" prop="tmName">
          <el-input placeholder="输入品牌名称" v-model="newBrandInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="上传LOGO" label-width="100px" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/api/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="newBrandInfo.logoUrl" :src="newBrandInfo.logoUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>

        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="confirm" size="default">确认</el-button>
        <el-button type="default" @click="cancel" size="default">取消</el-button>
      </template>
    </el-dialog>
   </div>
</template>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
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
