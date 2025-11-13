import { createRouter, createWebHistory } from 'vue-router';
import OrderBookMock from '../views/OrderBookMock.vue';
import OrderBookReal from '../views/OrderBookReal.vue';

const routes = [
  { path: '/', redirect: '/mock' },
  { path: '/mock', component: OrderBookMock },
  { path: '/real', component: OrderBookReal },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
