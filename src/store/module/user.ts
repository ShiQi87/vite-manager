//user仓库
import { defineStore } from "pinia";
import { reqLogin } from "@/api/user";
import type { LoginForm, LoginResponseData } from '@/api/user';
import { constantRoute } from "@/router/routes";
import type { UserState } from "../type";

let useUserStore = defineStore( 'User',{
  state():UserState {
    return {
      token: localStorage.getItem("TOKEN"),
      menuRoutes: constantRoute,
    }
  },//选项式写法，相当于vue2的data
  actions: {
    async userLogin(data:LoginForm) {
      let result: LoginResponseData = await reqLogin(data);
      //成功返回200和token
      //失败返回201，给出失败信息
      if (result.code === 200) {
        this.token = result.data.token;
        localStorage.setItem("TOKEN", this.token);
      } else {
        console.log(result);
        return Promise.reject(new Error(result.data.message));
      }
    }//返回promise，所以用异步
  },//相当于methods
  getters: {

  }//相当于computes
})

export default useUserStore;