export default {
  namespaced: true,
  store() {
    return {
      movies: [],
    };
  },
  mutations: {
    setMovies(state, payload) {
      state.movies = payload.trending;
      console.log("movies state", state.movies);
    },
  },
  actions: {
    async getTrendingMovies(context, payload) {
      const res = await fetch(`${apiBaseUrl}/trending`);
      const data = await res.json();
      context.commit("setMovies", data);
    },
    async getTrendingGenres(context, payload) {
      const res = await fetch(`${apiBaseUrl}/movies/genres/${payload.term}`);
      const data = await res.json();
      context.commit("setMovies", data);
    },
    async getSearchedResults(context, payload) {
      const res = await fetch(`${apiBaseUrl}/movies/search/${payload.term}`);
      const data = await res.json();

      const modifiedMovies = data.d.map((movie) => {
        return {
          name: movie.l,
          id: movie.id,
          poster: movie.i[0],
        };
      });

      console.log("modifiedmovies", modifiedMovies);

      context.commit("setMovies", { trending: modifiedMovies });
    },
  },
  getters: {
    movies(state) {
      return state.movies;
    },
  },
};
