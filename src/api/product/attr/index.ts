//属性相关api
import request from "@/utils/request";
import { AttrData, AttrResponse, CategoryResponse } from "./type";

enum API {
  CATEGORY01_URL = '/admin/product/getCategory1',
  CATEGORY02_URL = '/admin/product/getCategory2/',
  CATEGORY03_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/',
  UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',
  DELETE_ATTR_URL = '/admin/product/deleteAttr/'
}

export const reqCategory01 = () => request.get<any, CategoryResponse>(API.CATEGORY01_URL);
export const reqCategory02 = (id1: number) => request.get<any, CategoryResponse>(API.CATEGORY02_URL + id1);
export const reqCategory03 = (id2: number) => request.get<any, CategoryResponse>(API.CATEGORY03_URL + id2);
export const reqAttr = (id1, id2, id3) => request.get<any, AttrResponse>(API.ATTR_URL + `${id1}/${id2}/${id3}`);
export const reqAddOrUpdateAttr = (data: AttrData) => request.post<any, AttrResponse>(API.UPDATE_ATTR_URL, data);
export const reqDeleteAttr = (attrId:number) => request.delete<any, AttrResponse>(API.DELETE_ATTR_URL+`${attrId}`)