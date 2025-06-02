export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}
//定义SKU对象的ts类型
export interface Attr {
  id?: number;
  attrId: number | string;
  valueId: number | string;
  attrName?: string;
  valueName?: string;
  attrIdAndValueId?: string;  // 添加这个属性用于表单绑定
}
export interface SaleAttr {
  id?: number;
  saleAttrId: number | string;
  saleAttrValueId: number | string;
  saleAttrName?: string;
  saleAttrValueName?: string;
}
export interface SkuData {
  category3Id?: string | number;
  category1Id?: string | number;
  category2Id?: string | number;
  spuId?: string | number;
  tmId?: string | number;
  skuName?: string;
  price?: string | number;
  weight?: string | number;
  skuDesc?: string;
  skuAttrValueList?: Attr[];
  skuSaleAttrValueList?: SaleAttr[];
  skuDefaultImg?: string;
  isSale?: number;
  id?: number;
}

//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[];
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: null;
    maxLimit: null;
    searchCount: boolean;
    pages: number;
  };
}

//获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData;
}
