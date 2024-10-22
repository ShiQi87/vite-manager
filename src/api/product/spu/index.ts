import request from "@/utils/request";

enum API {
  SPU_URL = '/admin/product/'
}
 
export const reqHasSpu = (page: number, limit: number, categoryC3Id) => request.get<any, any>(API.SPU_URL+ `${page}/${limit}?category3Id=${categoryC3Id}`)