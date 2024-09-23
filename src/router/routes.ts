//暴露routes

const constantRoute =
  [{
    //登录路由
    path: '/login',
    component: () => import('@/views/Login.vue'),
    name: 'login'
  },
    {
      //主页路由
      path: '/',
      component: () => import('@/views/Home.vue'),
      name: 'home'
    },
    {
    //错误路由
      path: '/404',
      component: () => import('@/views/404.vue'),
      name: '404'
    },
    {
      //匹配任意路由，重定向到404路由
      path: '/:pathMatch(.*)*', //使用正则表达，多次匹配(*)多次匹配(*)任意单字符(.)，达到对所有的路由匹配的效果
      redirect: '/404',
      name: 'any'
    }
  ]

export default constantRoute;