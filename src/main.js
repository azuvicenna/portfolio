import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
// import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import i18n from './i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App);
const pinia = createPinia();

// pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(VueQueryPlugin)
app.use(pinia);
app.use(i18n);
app.mount("#app");
