import { createRouter, createWebHistory } from 'vue-router'
import NoLoginView from "@/views/NoLoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/manual',
      name: 'NoLoginView',
      component: NoLoginView
    },
    // {
    //   path: '/auto',
    //   name: 'AfterLoginView',
    //   component: () => import('../views/AfterLoginView.vue')
    // },
  ]
})

export default router
