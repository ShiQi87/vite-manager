import { ResponseData } from "@/api/user";

export type BrandResponseData = ResponseData & {
  data: ListData;
}

type ListData = {
  records: BrandData[];
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
}

export type BrandData = {
  id: number;
  createTime: Date;
  updateTime: Date;
  tmName: string;
  logoUrl: URL;
}