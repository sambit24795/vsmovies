import { createApp } from "vue";

import App from "../components/App.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import SubBaseCard from "../components/ui/SubBaseCard.vue";
import store from "../components/store/index";

const app = createApp(App);

app.component("base-card", BaseCard);
app.component("sub-base-card", SubBaseCard);

app.use(store);

app.mount(document.body);
