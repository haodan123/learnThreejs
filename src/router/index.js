import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './module/defulte'
// console.log(...routes);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...routes,
  {
    path: '/day11',
    name: 'day11',
    component: () => import("@/views/day1.vue"),

  },
  {
    path: '/day22',
    name: 'day22',
    component: () => import("@/views/day2.vue"),

  },
  {
    path: '/day33',
    name: 'day33',
    component: () => import("@/views/day3.vue"),
  },
  {
    path: '/day44',
    name: 'day44',
    component: () => import("@/views/day4.vue"),
  }, {
    path: '/day55',
    name: 'day55',
    component: () => import("@/views/day5.vue"),
  }, {
    path: '/test',
    name: 'test',
    component: () => import("@/views/day5 copy.vue"),
  },
  {
    path: '/vrProject',
    name: 'vrProject',
    component: () => import("@/views/vrProject/index.vue"),

  }
  ]
})

export default router
