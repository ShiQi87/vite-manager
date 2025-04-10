export interface Response{
  code: number,
  message: string,
  ok: boolean
}

export type CategoryResponse = Response & {
  data: Categories;
}

type Categories = Array<CategoryData>;

export type CategoryData = {
  id: number | string,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export interface AttrResponse extends Response {
  data: Attrs;
}

export type Attrs = Array<AttrData>;

export type AttrData = {
  id?: number,
  attrName: string,
  categoryId: number | string,
  categoryLevel: number,
  attrValueList: AttrValues
}

type AttrValues = Array<AttrValue>;

export type AttrValue = {
  id?: number,
  valueName: string,
  attrId?: number,
  flag?: boolean
}