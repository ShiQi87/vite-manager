import * as Icon from '@element-plus/icons-vue';

export default {
  install(app: any) {
    for (const [key, component] of Object.entries(Icon)) {
      app.component(key, component);
    }
  }
}