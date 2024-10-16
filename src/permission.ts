import router from "./router";
import useUserStore from "@/store/module/user";
import pinia from "./store";
import { inject } from "vue";

let userStore = useUserStore(pinia);

router.beforeEach(async (to, from, next) => {
  let { open, close }: any = inject('$progress');
  close();
  open();
  const token = userStore.token;
  const username = userStore.username;
  if (token) {
    if (to.path == '/login') {
      next('/');
    }
    else {
      if (username) {
        next();
      } else {
        try {
          await userStore.userInfo();//缺少信息获取信息
          next();
        } catch {
          userStore.userLogout();
          next({ path: '/login', query: { redirect: to.path } });
        }
      }
    }
  }
});
