import router from "./router";
import useUserStore from "@/store/module/user";
import pinia from "./store";
import { inject } from "vue";

let userStore = useUserStore(pinia);

// 路由守卫还有一个作用是阻止路由挂载，先获取权限后再加载新的路由，放止新的路由没有挂载上
router.beforeEach(async (to, from, next) => {
  let { open, close }: any = inject("$progress");
  close();
  open();
  const token = userStore.token;
  const username = userStore.username;
  if (token) {
    if (to.path == "/login") {
      next("/");
    } else {
      if (username) {
        next();
      } else {
        try {
          await userStore.userInfo(); //缺少信息获取信息
          next({ ...to, replace: true });
        } catch {
          await userStore.userLogout();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
});
