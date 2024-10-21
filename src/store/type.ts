import type { RouteRecordRaw } from "vue-router"

export type UserState = { 
  token: string | null,
  menuRoutes: RouteRecordRaw[],
  username: string | null,
  avatar: string | null,
  buttons: string[]
}

