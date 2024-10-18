import request from "@/utils/request";
import { BrandResponseData } from "./type";

enum API{
  BRAND_URL = '/admin/product/baseTrademark',
}

export const reqbrand = (page: number, limit: number) => request.get<any, BrandResponseData>(API.BRAND_URL + `/${page}/${limit}`)