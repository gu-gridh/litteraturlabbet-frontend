import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import { setBusy, setNotBusy } from "./components/Waiter.vue";

import matomo from 'vue-matomo';

import MasonryWall from "@yeger/vue-masonry-wall";

const app = createApp(App);

if (import.meta.env.VITE_MATOMO_URL && import.meta.env.VITE_MATOMO_ID) {
    app.use(matomo, {
        host: import.meta.env.VITE_MATOMO_URL,
        siteId: import.meta.env.VITE_MATOMO_ID,
        router: router,
        enableLinkTracking: true,
        trackInitialView: true,
        debug: false
    });
}
app.use(createPinia());
app.use(router);
app.use(MasonryWall)
app.provide("waiter", {
    setBusy, setNotBusy
});
app.mount("#app");
