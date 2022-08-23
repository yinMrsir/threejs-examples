import { createRouter, RouteRecordRaw, createWebHashHistory} from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/1', component: () => import('@/views/1.vue' ) },
  { path: '/2', component: () => import('@/views/2.vue' ) },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;