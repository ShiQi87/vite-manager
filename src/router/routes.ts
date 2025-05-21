//暴露routes
export const constantRoute = [
  {
    //登录路由
    path: "/login",
    component: () => import("@/views/Login.vue"),
    name: "Login",
    meta: {
      title: "登录",
      hidden: true,
      icon: "Edit",
    },
  },
  {
    //主页路由
    path: "/",
    component: () => import("@/layout/Layout.vue"),
    name: "Layout",
    meta: {
      title: "布局",
      hidden: false,
      icon: "Edit",
    },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/views/Home.vue"),
        name: "Home",
        meta: {
          title: "主页",
          hidden: false,
          icon: "Edit",
        },
      },
    ],
  },
  {
    //错误路由
    path: "/404",
    component: () => import("@/views/404.vue"),
    name: "404",
    meta: {
      title: "404",
      hidden: true,
      icon: "Edit",
    },
  },
];

// 异步路由
export const asyncRoute = [
  {
    //权限管理路由
    path: "/acl",
    component: () => import("@/layout/Layout.vue"),
    name: "Acl",
    meta: {
      title: "权限管理",
      hidden: false,
      icon: "Lock",
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/acl/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "User",
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/acl/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          hidden: false,
          icon: "UserFilled",
        },
      },
      {
        path: "/acl/permission",
        component: () => import("@/views/acl/permission/index.vue"),
        name: "Permission",
        meta: {
          title: "菜单管理",
          hidden: false,
          icon: "Monitor",
        },
      },
    ],
  },
  {
    //商品管理路由
    path: "/product",
    component: () => import("@/layout/Layout.vue"),
    name: "Product",
    meta: {
      title: "商品管理",
      hidden: false,
      icon: "Goods",
    },
    redirect: "/product/brand",
    children: [
      {
        path: "/product/brand",
        component: () => import("@/views/product/brand/index.vue"),
        name: "Brand",
        meta: {
          title: "品牌管理",
          hidden: false,
          icon: "ShoppingCartFull",
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/product/attr/index.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          hidden: false,
          icon: "ShoppingCartFull",
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/product/sku/index.vue"),
        name: "Sku",
        meta: {
          title: "sku管理",
          hidden: false,
          icon: "ShoppingCartFull",
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/product/spu/index.vue"),
        name: "Spu",
        meta: {
          title: "spu管理",
          hidden: false,
          icon: "ShoppingCartFull",
        },
      },
    ],
  },
];

// 任意路由
export const anyRoute = [
  {
    //匹配任意路由，重定向到404路由
    path: "/:pathMatch(.*)*", //使用正则表达，多次匹配(*)多次匹配(*)任意单字符(.)，达到对所有的路由匹配的效果
    redirect: "/404",
    name: "Any",
    meta: {
      title: "jump",
      hidden: true,
      icon: "Edit",
    },
  },
];
