export type ResponseData = {
  code: number;
  message: string;
  ok: boolean;
}

export type BrandResponseData = ResponseData & {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
  }
}

export type Records = BrandData[];

export type BrandData = {
  id?: number;
  tmName: string;
  logoUrl: string;
}