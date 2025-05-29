//服务器全部接口返回的数据类型
type ResponseData = {
  code: number;
  ok: boolean;
  message: string;
};

export type SpuResponseData = ResponseData & {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
  };
};

//数组:元素都是已有SPU数据类型
export type Records = Array<SpuData>;

//SPU数据的ts类型:需要修改
export type SpuData = {
  category3Id: string | number;
  id?: number;
  spuName: string;
  tmId: number | string;
  description: string;
  spuImageList: null | SpuImg[];
  spuSaleAttrList: null | SaleAttr[];
};

export type SaleAttr = {
  id?: number;
  createTime?: null;
  updateTime?: null;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValueList;
  flag?: boolean;
  saleAttrValue?: string;
};

export type SpuImg = {
  id?: number;
  spuId?: number;
  imgName?: string;
  imgUrl?: string;
  name?: string;
  url?: string;
};

//品牌数据的ts类型
export type Trademark = {
  id: number;
  tmName: string;
  logoUrl: string;
};

//品牌接口返回的数据类型
export type AllTrademark = ResponseData & {
  data: Trademark[];
};

export type ImageList = ResponseData & {
  data: SpuImg[];
};

export type SpuSaleAttrValue = {
  id?: number;
  createTime?: null;
  updateTime?: null;
  spuId?: number;
  baseSaleAttrId: number | string;
  saleAttrValueName?: string;
  saleAttrName?: string;
  isChecked?: null;
};

export type SpuSaleAttrValueList = SpuSaleAttrValue[];

export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[];
}

export type HasSaleAttr = {
  id: number;
  attrName: string;
};

export interface HasSaleAttrResponse extends ResponseData {
  data: HasSaleAttr[];
}

export interface saleArr {
  saleAttrId: number | string; //属性ID
  saleAttrValueId: number | string; //属性值的ID
}
export interface SkuData {
  category3Id: string | number; //三级分类的ID
  spuId: string | number; //已有的SPU的ID
  tmId: string | number; //SPU品牌的ID
  skuName: string; //sku名字
  price: string | number; //sku价格
  weight: string | number; //sku重量
  skuDesc: string; //sku的描述
  skuAttrValueList?: Attr[];
  skuSaleAttrValueList?: saleArr[];
  skuDefaultImg: string; //sku图片地址
}
//获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}