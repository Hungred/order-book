import { createRouter, createWebHistory } from 'vue-router';
// import OrderBookMock from '../views/OrderBookMock.vue';
// import OrderBookReal from '../views/OrderBookReal.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  // { path: '/', redirect: '/mock' },
  // { path: '/mock', component: OrderBookMock },
  // { path: '/real', component: OrderBookReal },
  { path: '/', name: 'dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
