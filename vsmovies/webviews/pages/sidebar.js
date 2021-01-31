import { createApp } from "vue";

import App from "../components/sidebar.vue";
import store from "../components/store/index";

const app = createApp(App);

app.use(store);

app.mount(document.body);
