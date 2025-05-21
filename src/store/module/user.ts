//user仓库
import { defineStore } from "pinia";
import { reqLogin, reqLogout, reqUserInfo } from "@/api/user";
import type { LoginForm, LoginResponseData, ResponseData } from "@/api/user";
import { constantRoute, asyncRoute, anyRoute } from "@/router/routes";
import type { UserState } from "../type";
import { UserInfo } from "@/api/user";
import { RouteRecordRaw } from "vue-router";
import router from "@/router";

// 此处计算异步路由，取有权限的路由
const getAsyncRoute = (asyncRoute: Array<RouteRecordRaw>, routes: any) => {
  return asyncRoute.filter((item) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = getAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
};

let useUserStore = defineStore("User", {
  state(): UserState {
    return {
      token: localStorage.getItem("TOKEN"),
      menuRoutes: [...constantRoute, ...asyncRoute, ...anyRoute],
      username: "",
      avatar: "",
      buttons: [],
    };
  }, //选项式写法，相当于vue2的data
  actions: {
    async userLogin(data: LoginForm) {
      let result: LoginResponseData = await reqLogin(data);
      //成功返回200和token
      //失败返回201，给出失败信息
      if (result.code === 200) {
        // this.token = result.data;
        this.token = "Admin Token";
        localStorage.setItem("TOKEN", this.token);
        this.userInfo();
      } else {
        return Promise.reject(new Error(result.message));
      }
    }, //返回promise，所以用异步
    async userInfo() {
      let result: UserInfo = await reqUserInfo();
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        // 用序列化反序列化获取副本
        const userAsyncRoute = getAsyncRoute(
          JSON.parse(JSON.stringify(asyncRoute)),
          result.data.routes
        );
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        [...userAsyncRoute, ...anyRoute].forEach((route) => {
          router.addRoute(route);
        });

        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    async userLogout() {
      let result: ResponseData = await reqLogout();
      if (result.code == 200) {
        this.username = "";
        this.avatar = "";
        this.buttons = [];
        this.token = "";
        localStorage.removeItem("TOKEN");
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
  }, //相当于methods
  getters: {}, //相当于computes
});

export default useUserStore;
