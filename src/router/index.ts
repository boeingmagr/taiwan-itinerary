import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Views are lazy-loaded so the initial bundle stays small (Leaflet and the print
// view land here later). `/theme` is the Tea Room style-guide preview from T-2.
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'trips', component: () => import('@/views/TripListView.vue') },
  { path: '/trips/:id', name: 'trip', component: () => import('@/views/TripView.vue') },
  {
    path: '/trips/:id/days/:dayId',
    name: 'day',
    component: () => import('@/views/DayView.vue'),
  },
  {
    path: '/trips/:id/print',
    name: 'print',
    component: () => import('@/views/PrintView.vue'),
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('@/components/ThemePreview.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
