//user仓库
import { defineStore } from "pinia";
import { loginForm, reqLogin } from "@/api/user";

let useUserStore = defineStore( 'User',{
  state: () => {
    return {
      token: localStorage.getItem("TOKEN"),
    }
  },//选项式写法，相当于vue2的data
  actions: {
    async userLogin(data:loginForm) {
      let result: any = await reqLogin(data);
      //成功返回200和token
      //失败返回201，给出失败信息
      if (result.code === 200) {
        this.token = result.data.token;
        localStorage.setItem("TOKEN", this.token);
        return "OK";
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