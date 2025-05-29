import request from "@/utils/request";
import {
  AllTrademark,
  HasSaleAttrResponse,
  ImageList,
  SaleAttrResponseData,
  SkuData,
  SkuInfoData,
  SpuData,
  SpuResponseData,
} from "./type";
enum API {
  SPU_URL = "/admin/product/",
  //获取全部品牌数据
  ALLBRAND_URL = "/admin/product/baseTrademark/getTrademarkList",
  SPUIMAGELIST_URL = "/admin/product/spuImageList/",
  SPUSALEATTRLIST_URL = "/admin/product/spuSaleAttrList/",
  ALLSALEATTR_URL = "/admin/product/baseSaleAttrList",

  //追加一个新的SPU
  ADDSPU_URL = "/admin/product/saveSpuInfo",
  //更新已有的SPU
  UPDATESPU_URL = "/admin/product/updateSpuInfo",
  //删除已有的SPU
  REMOVESPU_URL = "/admin/product/deleteSpu/",
  //追加一个新增的SKU地址
  ADDSKU_URL = "/admin/product/saveSkuInfo",
  //查看某一个已有的SPU下全部售卖的商品
  SKUINFO_URL = "/admin/product/findBySpuId/",
}

export const reqHasSpu = (page: number, limit: number, categoryC3Id: any) =>
  request.get<any, SpuResponseData>(
    API.SPU_URL + `${page}/${limit}?category3Id=${categoryC3Id}`
  );
export const reqAllBrand = () =>
  request.get<any, AllTrademark>(API.ALLBRAND_URL);
export const reqSpuImageList = (spuid: number) =>
  request.get<any, ImageList>(API.SPUIMAGELIST_URL + spuid);
export const reqSpuSaleAttrList = (spuid: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUSALEATTRLIST_URL + spuid);
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponse>(API.ALLSALEATTR_URL);
//追加新的spu
export const reqAddOrUpdateSpu = (spuInfo: SpuData) =>
  //   spuInfo.id
  //     ? request.post<any, any>(API.UPDATESPU_URL, spuInfo) :
  request.post<any, any>(API.ADDSPU_URL, spuInfo);
//删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId);

//添加SKU的请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data);

//获取SKU数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId);
