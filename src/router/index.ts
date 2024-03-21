import { createRouter, createWebHistory } from "vue-router";
import ReuseView from "@/views/ReuseView.vue";
import ClusterDetailView from "@/views/ClusterDetailView.vue";
import AboutView from "@/views/AboutView.vue"
import EmbeddingView from "@/views/EmbeddingView.vue";
import PageView from "@/views/PageView.vue";
import GalleryView from "@/views/GalleryView.vue";
import ImageViewer from "@/views/ImageViewer.vue";
import AuthorLink from "@/components/AuthorLink.vue";
import PhraseView from "@/views/PhraseView.vue";

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
    },
    {
      path: "/reuse/:author/:work?",
      name: "reuse2",
      component: ReuseView,
      props: (route) => ({
        author: route.params.author ? Number(route.params.author): undefined,
        work: route.params.work ? Number(route.params.work) : undefined,
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
      path: "/reuse/link/:id1/:id2",
      name: "reuse-link",
      component: AuthorLink,
      props: (route) => ({
        author1: route.params.id1 ? Number(route.params.id1): undefined,
        author2: route.params.id2 ? Number(route.params.id2) : undefined,
      }),
    },
    {
      path: "/reuse/phrase/:phrase",
      name: "reuse-phrase",
      component: PhraseView,
      props: (route) => ({
        author: route.params.author ? Number(route.params.author): undefined,
        work: route.params.work ? Number(route.params.work) : undefined,
        phrase: route.params.phrase ? route.params.phrase : undefined,
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
      component: GalleryView,
      props: true,
    },
  ],
});


export default router;
