import pinia from "@/store"
import useUserStore from "@/store/module/user"

const userStore = useUserStore(pinia); // 确保仓库初始化

export const buttonFilter = (app: any) => {
	// 自定义指令, 后续通过v-has调用
	app.directive("has", {
		mounted(el: any, option: any) {
			if (!userStore.buttons.includes(option.value))
				el.parentNode.removeChild(el);
		},
  });
}