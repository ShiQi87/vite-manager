export type LoginForm = {//type定义类型只能定义一次，interface定义类型多次定义会合二为一
  username: string,
  password: string,
}

type DataType = {
  token?: string,
  message?: string
}

export type LoginResponseData = {
  code: number,
  data: DataType,
}

type User = {
  checkUser: UserInfo;
  message?: string
}

export type UserInfo = {
  userId: number,
  avatar:string,
  username: string,
  password: string,
  desc: string,
  roles: string[],
  buttons: string[],
  routes: string[],
  token: string
}
export type UserResponseData = {
  code: number;
  data: User;
}
enum API {  //配置文件中配置自动添加/api前缀
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info"
}

import request from "@/utils/request"
//登录接口
export const reqLogin = (data: LoginForm) => request.post<any, LoginResponseData>(API.LOGIN_URL, data);
//用户接口
export const reqUserInfo = () => request.get<any, UserResponseData>(API.USERINFO_URL);