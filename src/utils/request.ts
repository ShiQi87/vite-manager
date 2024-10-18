//对axios二次封装使用请求和响应拦截器
import axios from 'axios';
import { ElMessage } from 'element-plus';
import useUserStore from '@/store/module/user';
//用create创建新的axios实例，在这个实例上封装自己的方法
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,//在这里配置请求的默认开头,此处是api
  timeout: 5000,
});
//添加请求和响应拦截器

request.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config;//config中包含一个请求头，给服务器端携带请求参数
  //不返回config不能发送请求
});

//响应拦截器
request.interceptors.response.use(
  response => {
    return response.data;
  }, error => {
    let msg = '';
    let status = error.response.status;
    switch (status) {
      case 401:
        msg = 'token过期';
        break;
      case 403:
        msg = '没有权限';
        break;           
      case 404:
        msg = '请求地址错误';
        break;
      case 500:
        msg = '服务器出现问题';
        break;
      default:
        msg = '网络出现问题';
        break;
    }


    ElMessage({
      type: 'error',
      message: msg,
    }); 
    return Promise.reject(error);//axios会返回一个resolve状态的Promise，不管请求是否成功，所以应该手动返回一个reject状态的Promise方便中断Promise链
});
// ajax
// onreadystatechange

export default request;