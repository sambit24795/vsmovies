import { createStore } from "vuex";

import authModule from "./auth";
import movieModule from "./movies";
import castModule from "./cast";

const store = createStore({
  modules: {
    auth: authModule,
    movie: movieModule,
    cast: castModule,
  },
});

export default store;
