import request from "@/utils/request";
import { BrandData, BrandResponseData, ResponseData } from "./type";

enum API{
  BRAND_URL = '/admin/product/baseTrademark',
  ADD_BRAND_URL = '/admin/product/baseTrademark/save',
  UPDATE_BRAND_URL = '/admin/product/baseTrademark/update',
  DELETE_BRAND_URL = '/admin/product/baseTrademark/remove/',
}

export const reqbrand = (page: number, limit: number) => request.get<any, BrandResponseData>(API.BRAND_URL + `/${page}/${limit}`)

export const reqAddOrUpdateBrand = (data: BrandData) => {
  if (data.id) {
    return request.put<any, BrandResponseData>(API.UPDATE_BRAND_URL, data);
  }
  else {
    return request.post<any, BrandResponseData>(API.ADD_BRAND_URL, data);
  }
}

export const reqDelete = (id: number) => request.delete<any, ResponseData>(API.DELETE_BRAND_URL + id)