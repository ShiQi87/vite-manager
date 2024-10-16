//路由创建
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { constantRoute } from './routes'
let router = createRouter({
  history: createWebHistory(),
  routes: (constantRoute as RouteRecordRaw[]),
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    }
  }
});
export default router;