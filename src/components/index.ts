import * as Icon from '@element-plus/icons-vue';
import MyProgress from '@/components/Progress.vue'
import { createVNode, render } from 'vue';
import Category from './Category.vue';

export default {
  install(app: any) {
    app.component('Category', Category);

    for (const [key, component] of Object.entries(Icon)) {
      app.component(key, component);
    }

    let VNode = createVNode(MyProgress);
    render(VNode, document.body);
    app.provide('$progress', {
      open: VNode.component?.exposed?.open,
      close: VNode.component?.exposed?.close
    });
  }
}