import { loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
import path from "path";
//引入svg
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// https://vitejs.dev/config/
export default (function (_a) {
  var _b;
  var command = _a.command,
    mode = _a.mode;
  var env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        enable: command === "serve",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), //给src配置别名。@
      },
    },
    //sass全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/style/global.scss";',
        },
      },
    },
    //配置代理跨域
    server: {
      proxy:
        ((_b = {}),
        (_b[env.VITE_APP_BASE_API] = {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: function (path) {
            // console.log(path);
            return path.replace(/^\/api/, "");
          }, //配置代理只有api开头才代理，默认api开头，转发时也会带api，但是真实地址没有api，所以重写
        }),
        _b),
    },
  };
});
