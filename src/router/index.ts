import { createRouter, createWebHistory } from "vue-router";
import ReuseView from "@/views/ReuseView.vue";
import ClusterDetailView from "@/views/ClusterDetailView.vue";
import HomeView from "@/views/HomeView.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/explore/",
      name: "explore",
      component: ReuseView,
      props: (route) => ({
        author: Number(route.query.author),
        work: Number(route.query.work),
      }),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/explore/cluster/:id",
      name: "cluster",
      component: ClusterDetailView,
      props: true,
    },
  ],
});

export default router;
