export type LoginForm = {//type定义类型只能定义一次，interface定义类型多次定义会合二为一
  username: string;
  password: string;
}

export type ResponseData = {
  code: number;
  message: string;
  ok: boolean;
}
export interface LoginResponseData extends ResponseData{
  data: {
	token: string,
	username: string,
	userId: string
  };
}

export interface UserInfo  extends ResponseData {
  data: {
    routes: string[];
    buttons: string[];
    roles: string[];
    username: string;
    avatar: string;
  }
}

//type写法
// export type UserInfo = UserResponseData & {
//   data: {
//     routes: string[]
//     buttons: string[]
//     roles: string[]
//     name: string
//     avatar: string
//   }
// }

// enum API {  //配置文件中配置自动添加/api前缀
//   LOGIN_URL = "/user/login",
//   USERINFO_URL = "/user/info",
//   LOGOUT_URL = "/user/logout"
// }
enum API {  //配置文件中配置自动添加/api前缀
  LOGIN_URL = "/admin/acl/index/login",
  USERINFO_URL = "/admin/acl/index/info",
  LOGOUT_URL = "/admin/acl/index/logout"
}

import request from "@/utils/request"
//登录接口
export const reqLogin = (data: LoginForm) => request.post<any, LoginResponseData>(API.LOGIN_URL, data);
//用户接口
export const reqUserInfo = () => request.get<any, UserInfo>(API.USERINFO_URL);

export const reqLogout = () => request.post<any, ResponseData>(API.LOGOUT_URL);