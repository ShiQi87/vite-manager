import { createApp } from 'vue';
import App from './App.vue';
//引入element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCN from 'element-plus/dist/locale/zh-cn';
import router from './router';
import '@/style/index.scss'
import pinia from './store';
//引入全局组件
import globalComponents from '@/components/index';

//创建应用实例
const app = createApp(App);
//安装插件
app.use(ElementPlus, {
  locale: zhCN,
});
//使用全局组件
app.use(globalComponents);
app.use(router);
app.use(pinia);

import '@/permission'
//挂载实例到app上
app.mount('#app');