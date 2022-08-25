import { createRouter, RouteRecordRaw, createWebHistory} from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'index', component: () => import('@/views/index.vue'), meta: { title: 'index' } },
  { path: '/1', name: 'demo1', component: () => import('@/views/1.vue' ), meta: { title: 'demo1' } },
  { path: '/2', name:'demo2', component: () => import('@/views/2.vue' ), meta: { title: 'demo2' } },
  { path: '/3', name:'demo3', component: () => import('@/views/3.vue' ), meta: { title: 'demo3' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
