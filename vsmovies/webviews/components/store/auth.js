export default {
  namespaced: true,
  store() {
    return {
      userId: null,
      token: null,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
    },
  },
  actions: {
    async login(context, payload) {
      const res = await fetch(`${apiBaseUrl}/me`, {
        headers: {
          authorization: `Bearer ${payload.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.message || "Failed to authenticate");
        throw error;
      }

      context.commit("setUser", {
        token: payload.token,
        userId: data.user.githubId,
      });
    },
    logout(context) {
      context.commit("setUser", {
        token: null,
        userId: null,
      });
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
  },
};
