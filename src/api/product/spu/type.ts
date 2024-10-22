type ResponseData = {
  code: number,
  ok: boolean,
  message: string
}

type SpuResponseData = {
  data: {
    records: Records,
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
    pages: number
  }
}

type Records = Array<SpuData>;

type SpuData = {
  category3Id: string | number
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}