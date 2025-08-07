//对axios二次封装使用请求和响应拦截器
import axios, { InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/module/user";
//用create创建新的axios实例，在这个实例上封装自己的方法
let request = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API, //在这里配置请求的默认开头,此处是api
	timeout: 5000,
});

// 后添加的拦截器先执行
const pendingRequests = new Map();

/**
 * 生成唯一请求标识
 * @param config axios 设置
 * @returns
 */
function getRequestId(config: InternalAxiosRequestConfig) {
	return [
		config.method,
		config.url,
		JSON.stringify(config.params),
		JSON.stringify(config.data),
	].join("&");
}

// 两种方法实现请求取消，一种是fetch api的AbortController, 一种是axios基于Promise的CancelToken
/**
 *为config添加取消请求controller
 * @param config axios 设置
 * @returns 包装后添加了controller的axios设置
 */
function addPendingRequest(config: InternalAxiosRequestConfig) {
	const requestId = getRequestId(config);

	// 防抖处理已有的相同请求
	if (pendingRequests.has(requestId)) {
		pendingRequests.get(requestId).abort();
		pendingRequests.delete(requestId);
	}
	
	const controller = new AbortController();
	config.signal = controller.signal;
	pendingRequests.set(requestId, controller);
	return config;
}

/**
 * 如果得到了响应就移除Pending列表中的这条请求
 * @param config 响应中的config
 */
function removePendingRequest(config: InternalAxiosRequestConfig) {
	const requestId = getRequestId(config);
	if (pendingRequests.has(requestId)) {
		const controller = pendingRequests.get(requestId);
		controller.abort();
		pendingRequests.delete(requestId);
	}
}

//添加请求和响应拦截器

request.interceptors.request.use(
	(config) => {
		const userStore = useUserStore();
		if (userStore.token) {
			config.headers.token = userStore.token;
		}
		config = addPendingRequest(config);
		return config; //config中包含一个请求头，给服务器端携带请求参数
		//不返回config不能发送请求
	},
	(error) => Promise.reject(error)
);

//响应拦截器
request.interceptors.response.use(
	(response) => {
		removePendingRequest(response.config);
		return response.data;
	},
	(error) => {
		let msg = "";
		let status = error.response.status;
		switch (status) {
			case 401:
				msg = "token过期";
				break;
			case 403:
				msg = "没有权限";
				break;
			case 404:
				msg = "请求地址错误";
				break;
			case 500:
				msg = error.response.data.message;
				break;
			default:
				msg = "网络出现问题";
				break;
		}

		ElMessage({
			type: "error",
			message: msg,
		});
		return Promise.reject(error); //axios会返回一个resolve状态的Promise，不管请求是否成功，所以应该手动返回一个reject状态的Promise方便中断Promise链
	}
);
// ajax
// onreadystatechange

export default request;
