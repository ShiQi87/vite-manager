<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"/>
      <el-col :span="12" :xs="24"> 
        <el-form class="login_form" :model="logInfo" :rules ref="logInfoRef">
          <h1>欢迎</h1>
          <h2>前端平台</h2>
          <el-form-item prop='username'>
            <el-input :prefix-icon="User" v-model="logInfo.username"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="logInfo.password" show-password/>
          </el-form-item>
          <el-form-item>
            <el-button :loading type="primary" size="default" class="login_btn" @click="login"> 登录 </el-button>
          </el-form-item>
        </el-form> 
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts'>
import { ElForm, ElRow, ElCol, ElFormItem, ElInput, ElButton, ElNotification } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import useUserStore from '@/store/module/user';
import { useRouter, useRoute } from 'vue-router';
import { getNowTime } from '@/utils/gettime';
//收集账号和密码
let logInfo = reactive({ username: 'admin', password: '111111' });
let loading = ref(false);
let logInfoRef = ref();

let userStore = useUserStore();
let router = useRouter();
let $route = useRoute();

//登录，调用登录接口
const login = async () => {
  await logInfoRef.value.validate();
  loading.value = true;
  userStore.userLogin(logInfo).then(() => {
    let redirect: any = $route.query.redirect;
    router.push({ path: redirect || '/' });
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: 'HI,' + getNowTime() + '好'
    });
  }, (reason) => {
    loading.value = false;
    ElNotification({
      type: 'error',
      message: (reason as Error).message//断言reason类型，若为Error则输出，这是ts的功能
    });
  });
}

const validatorUserName = (rule: any, value: any, callback: any) => {
  if (/^.{5,10}$/.test(value)) {
    callback();
  } else {
    callback(new Error('账号长度至少五位,最多十位'));
  }
}

const rules = {
  username: [{ trigger: 'change', validator: validatorUserName }],
  password: [{required: true, min: 5, max: 10, message: '密码至少五位', trigger: 'change'}]
}

</script>

<style lang='scss' scoped>
.login_container{
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form{
    position: relative;
    width: 80%;
    top: 30vh;
    background: linear-gradient(rgba(0, 255, 255, 0.2), rgba(0, 0, 255, 0.2));
    border-radius: 5px;
    padding: 2vw;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }
  }
  .login_btn{
    width: 100%;
  }
}
</style>

