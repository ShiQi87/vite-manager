//user仓库
import { defineStore } from "pinia";
import { reqLogin, reqLogout, reqUserInfo } from "@/api/user";
import type { LoginForm, LoginResponseData } from '@/api/user';
import { constantRoute } from "@/router/routes";
import type { UserState } from "../type";
import { UserResponseData } from "@/api/user";

let useUserStore = defineStore('User', {
  state(): UserState {
    return {
      token: localStorage.getItem("TOKEN"),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: []
    }
  },//选项式写法，相当于vue2的data
  actions: {
    async userLogin(data: LoginForm) {
      let result: LoginResponseData = await reqLogin(data);
      //成功返回200和token
      //失败返回201，给出失败信息
      if (result.code === 200) {
        this.token = result.data.token;
        localStorage.setItem("TOKEN", this.token);
      } else {
        return Promise.reject(new Error(result.data.message));
      }
    },//返回promise，所以用异步
    async userInfo() {
      let result: UserResponseData = await reqUserInfo();
      if (result.code == 200) {
        this.username = result.data.checkUser.username;
        this.avatar = result.data.checkUser.avatar;
        this.buttons = result.data.checkUser.buttons;
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
    async userLogout() {
      let result = await reqLogout();
      if (result.code == 200) {
        this.username = '';
        this.avatar = '';
        this.buttons = [];
        localStorage.removeItem('TOKEN');
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data.message));
      }
    }
  },//相当于methods
  getters: {

  }//相当于computes
})

export default useUserStore;