

export default [

  {
    path: '/',
    name: 'index1',
    component: () => import("@/layout/index.vue"),
    redirect: '/initThree',
    meta: { title: 'day1' },
    children: [
      {
        path: '/initThree',
        name: 'initThree',
        meta: { title: '初始化' },

        component: () => import("@/views/day1/initThree.vue"),
      },
      {
        path: '/moveCube',
        name: 'moveCube',
        meta: { title: '移动立方体' },

        component: () => import("@/views/day1/moveCube.vue"),
      },
      {
        path: '/anli1',
        name: 'anli1',
        meta: { title: '案例1' },

        component: () => import("@/views/anli1.vue"),
      }
    ]
  },

  {
    path: "/day2",
    name: "day2",
    component: () => import("@/layout/index.vue"),
    redirect: "/duoCube",
    meta: { title: "day2" },
    children: [
      {
        path: "/duoCube",
        component: () => import("@/views/day2/duoCube.vue"),
        name: "duoCube",
        meta: { title: "多个随机的立方体" },
      },
      {
        path: "/duoGeometry",
        component: () => import("@/views/day2/duoGeometry.vue"),
        name: "duoGeometry",
        meta: { title: "多个不同形状的图形" },
      },
      {
        path: "/pointsSpher",
        component: () => import("@/views/day2/pointsSpher.vue"),
        name: "pointsSpher",
        meta: { title: "点球体" },
      },
      {
        path: "/lineSpher",
        component: () => import("@/views/day2/lineSpher.vue"),
        name: "lineSpher",
        meta: { title: "线球体" },
      },
      {
        path: "/createMap",
        component: () => import("@/views/day2/createMap.vue"),
        name: "createMap",
        meta: { title: "全景贴图" },
      },
      {
        path: "/createCubeImg",
        component: () => import("@/views/day2/createCubeImg.vue"),
        name: "createCubeImg",
        meta: { title: "立方体贴图" },
      }, {
        path: "/anli",
        component: () => import("@/views/day2/anli.vue"),
        name: "anli",
        meta: { title: "全景公园案例" },
      }, {
        path: "/videoMap",
        component: () => import("@/views/day2/videoMap.vue"),
        name: "videoMap",
        meta: { title: "视频纹理" },
      }, {
        path: "/tddomAndClick",
        component: () => import("@/views/day2/tddomAndClick.vue"),
        name: "tddomAndClick",
        meta: { title: "css转换3d" },
      },

    ],
  },

]
