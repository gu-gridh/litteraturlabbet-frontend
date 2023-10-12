import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import { setBusy, setNotBusy } from "./components/Waiter.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.provide("waiter", {
    setBusy, setNotBusy
});
app.mount("#app");
