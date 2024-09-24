export type loginForm = {//type定义类型只能定义一次，interface定义类型多次定义会合二为一
  username: string,
  password: string,
}

type datatype = {
  token: string,
}

export type loginResponseData = {
  code: number,
  data: datatype,
}

type user = {
  checkUser: userInfo;
}

type userInfo = {
  userId: number,
  avatar:string,
  username: string,
  password: string,
  desc: string,
  roles: string[],
  buttons: string[],
  routes: string[],
  token: string,
}
export type userResponseData = {
  code: number;
  data: user;
}
enum API {  //配置文件中配置自动添加/api前缀
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info"
}

import request from "@/utils/request"
//登录接口
export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data);
//用户接口
export const reqUserInfo = () => request.get<userResponseData>(API.USERINFO_URL);