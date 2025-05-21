import type { RouteRecordRaw } from "vue-router"
import type { CategoryData } from "@/api/product/attr/type";

export type UserState = { 
  token: string | null,
  menuRoutes: RouteRecordRaw[],
  username: string | null,
  avatar?: string,
  buttons: string[]
}

export interface CategoryState {
  c1Id: string | number;
  c1Attr: CategoryData[];
  c2Attr: CategoryData[];
  c2Id: string | number;
  c3Attr: CategoryData[];
  c3Id: string | number;
}