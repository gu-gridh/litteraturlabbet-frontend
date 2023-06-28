import { createRouter, createWebHistory } from "vue-router";
import ReuseView from "@/views/ReuseView.vue";
import ClusterDetailView from "@/views/ClusterDetailView.vue";
import AboutView from "@/views/AboutView.vue"
import EmbeddingView from "@/views/EmbeddingView.vue";
import PageView from "@/views/PageView.vue";
import GalleryView from "@/views/GalleryView.vue";
import ImageViewer from "@/views/ImageViewer.vue";
import AuthorLink from "@/components/AuthorLink.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: AboutView
    },
    {
      path: "/reuse/",
      name: "reuse",
      component: ReuseView,
      props: (route) => ({
        author: route.query.author ? Number(route.query.author): undefined,
        work: route.query.work ? Number(route.query.work) : undefined,
      }),
    },
    {
      path: "/embedding/",
      name: "embedding",
      component: EmbeddingView
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
      path: "/reuse/cluster/:id",
      name: "cluster",
      component: ClusterDetailView,
      props: true,
    },
    {
      path: "/reuse/page/:id/",
      name: "page",
      component: PageView,
      props: (route) => ({
        id: route.params.id ? Number(route.params.id): undefined,
        segment: route.query.segment ? Number(route.query.segment) : undefined,
      }),
    },
    {
      path: "/gallery",
      name: "gallery",
      component: GalleryView,
      //TBD
      // props: (route) => ({})
    },
    {
      path: "/gallery/:id",
      name: "image-viewer",
      component: ImageViewer,
      props: true,
    },
    {
      path: "/link/",
      name: "link",
      component: AuthorLink,
      props: (route) => ({
        author1: route.query.author1 ? Number(route.query.author1): undefined,
        author2: route.query.author2 ? Number(route.query.author2): undefined,
      }),
    }
  ],
});


export default router;
