<template>
  <el-card style="height: 70px; margin-bottom: 10px">
    <el-form :inline="true" class="search-bar">
      <el-form-item label="用户名：">
        <el-input placeholder="输入搜索的用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" icon="refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button type="primary" icon="plus" @click="addorUpdateUser"
      >添加用户</el-button
    >
    <el-button type="danger" icon="delete" @click="deleteSelectedUser"
      >批量删除</el-button
    >
    <el-table
      style="margin: 10px 0"
      border
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{ row, $indeex }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="addorUpdateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`确定要删除${row.username}吗`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    ></el-pagination>
  </el-card>
  <el-drawer v-model="addAndUpdateDrawer">
    <template #header>
      <h4>{{ userParams.id ? "更新用户" : "添加用户" }}</h4>
    </template>
    <!-- 收集用户信息 -->
    <template #default
      ><el-form :model="userParams" :rule="userRules" ref="formRef">
        <el-form-item label="用户名" prop="username"
          ><el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input
        ></el-form-item>
        <el-form-item label="用户昵称" prop="name"
          ><el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input
        ></el-form-item>
        <el-form-item label="用户密码" v-if="!userParams.id" prop="password"
          ><el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input
        ></el-form-item> </el-form
    ></template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel"> 取消 </el-button>
        <el-button type="primary" @click="save"></el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="setRoleDrawer">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form
        ><el-form-item label="用户姓名"
          ><el-input
            v-model="userParams.username"
            :disabled="true"
          ></el-input></el-form-item
        ><el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          ></el-form-item
        ><el-checkbox-group
          v-model="userRole"
          @change="handleCheckedRolesChange"
        >
          <el-checkbox
            v-for="(role, index) in allRole"
            :key="index"
            :label="role"
          >
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group></el-form
      >
    </template>
    <template #footer
      ><div style="flex: auto">
        <el-button @click="setRoleDrawer = false">取消</el-button>
        <el-button type="primary" @click="setConfirm">确定</el-button>
      </div></template
    >
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from "@/api/acl/user";
import {
  type UserResponseData,
  type Records,
  type User,
  AllRole,
  AllRoleResponseData,
  SetRoleData,
} from "@/api/acl/user/type";
import { onMounted, reactive, ref, nextTick } from "vue";
import useTopbarStore from "@/store/module/topbar";
import { ElMessage } from "element-plus";

let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
//用户数据总量
let total = ref<number>(0);

// 存储全部用户的数组
let userArr = ref<Records>([]);
// 存储用户关键字
let keyword = ref<string>("");

// 引入topbarstore控制页面刷新
const topbarStore = useTopbarStore();

// 挂载完毕加载用户数据
onMounted(() => {
  getHasUser();
});

const handler = () => {
  getHasUser();
};

const getHasUser = async (pager: number = 1) => {
  pageNo.value = pager;
  let result: UserResponseData = await reqUserInfo(
    pager,
    pageSize.value,
    keyword.value
  );
  if (result.code == 200) {
    total.value = result.data.total;
    userArr.value = result.data.records;
  }
};

const search = () => {
  getHasUser();
  keyword.value = ""; // 搜完清除
};

const reset = () => {
  topbarStore.refresh = !topbarStore.refresh;
};

// 控制抽屉开关
let addAndUpdateDrawer = ref<boolean>(false);
let setRoleDrawer = ref<boolean>(false);
// 收集用户信息
let userParams = reactive<User>({
  username: "",
  name: "",
  password: "",
});
// 收集表格实例
let formRef = ref();

const validateUsername = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户名字至少五位"));
  }
};

const validateName = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户昵称至少五位"));
  }
};

const validatePassword = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称,长度至少五位
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error("用户密码至少六位"));
  }
};

// 表单校验用户信息
const userRules = {
  username: [{ required: true, trigger: "blur", validator: validateUsername }],
  name: [{ required: true, trigger: "blur", validator: validateName }],
  password: [{ required: true, trigger: "blur", validator: validatePassword }],
};

const addorUpdateUser = (
  row: User = {
    id: 0,
    username: "",
    name: "",
    password: "",
  }
) => {
  addAndUpdateDrawer.value = true;
  Object.assign(userParams, row);
  // 清除之前验证留下的警告
  nextTick(() => {
    formRef.value.clearValidate();
  });
};

const cancel = () => {
  addAndUpdateDrawer.value = false;
};

const save = async () => {
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateUser(userParams);
  if (result.code == 200) {
    cancel();
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "添加成功",
    });
    // 填完重置
    reset();
  } else {
    cancel();
    //提示消息
    ElMessage({
      type: "error",
      message: userParams.id ? "更新失败" : "添加失败",
    });
  }
};

// 控制职位全选
let checkAll = ref<boolean>(false);
// 存储所有职位
let allRole = ref<AllRole>([]);
// 控制顶部全选复选框不确定的样式
let isIndeterminate = ref<boolean>(true);
// 存储目前已选择的职位
let userRole = ref<AllRole>([]);

// 获取全部的职位的数据与当前用户已有的职位的数据
const setRole = async (row: User) => {
  Object.assign(userParams, row);
  const result: AllRoleResponseData = await reqAllRole(userParams.id as number);
  if (result.code == 200) {
    allRole.value = result.data.allRolesList;
    userRole.value = result.data.assignRoles;
    setRoleDrawer.value = true;
  }
};

// 全选改变钩子
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : [];
  isIndeterminate.value = false;
};
// 复选改变钩子
const handleCheckedRolesChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length;
  isIndeterminate.value = value.length !== allRole.value.length;
};
// 分配确认回调
const setConfirm = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => item.id as number),
  };

  const result = await reqSetUserRole(data);
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: "success", message: "分配职务成功" });
    //关闭抽屉
    setRoleDrawer.value = false;
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value);
  }
};

// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

// 存储选中要删除的用户
let selectIdArr = ref<User[]>([]);

const selectChange = (value: any) => {
  selectIdArr.value = value;
};

// 删除选中用户
const deleteSelectedUser = async () => {
  let idList: number[] = selectIdArr.value.map((item) => item.id as number);
  const result: any = await reqSelectUser(idList);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
}
</style>
