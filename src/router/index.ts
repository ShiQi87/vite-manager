//路由创建
import { createRouter, createWebHistory } from "vue-router";
import routes from './routes'
// import Login from "@/views/Login.vue";
let router = createRouter({
  history: createWebHistory(),
  routes: (routes as any),
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
}
);
export default router;