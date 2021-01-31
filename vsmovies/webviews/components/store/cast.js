export default {
  namespaced: true,
  store() {
    return {
      cast: [],
    };
  },
  mutations: {
    setCast(state, payload) {
      state.cast = payload.cast;
    },
  },
  actions: {
    async getCast(context, payload) {
      const res = await fetch(`${apiBaseUrl}/movies/${payload.id}`);
      const data = await res.json();
      console.log("data", data);
      context.commit("setCast", data);
    },
    async resetCast(context) {
      context.commit("setCast", { cast: [] });
    },
  },
  getters: {
    casts(state) {
      return state.cast;
    },
  },
};
