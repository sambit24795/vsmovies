<template>
  <base-card
    v-for="movie in movieList"
    :name="movie.name"
    :poster="movie.poster"
    :id="movie.id"
    :key="movie.id"
  ></base-card>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const movieList = ref([]);

    onMounted(async () => {
      await store.dispatch("movie/getTrendingMovies");
      const movies = store.getters["movie/movies"];
      movieList.value = movies;
    });

    window.addEventListener("message", async (event) => {
      const message = event.data;
      console.log("message", message);
      switch (message.type) {
        case "get-movie-store":
          await store.dispatch("movie/getTrendingGenres", {
            term: message.value,
          });
          movieList.value = store.getters["movie/movies"];
          break;
        case "get-searched-movie-store":
          await store.dispatch("movie/getSearchedResults", {
            term: message.value,
          });
          movieList.value = store.getters["movie/movies"];
          break;
      }
    });

    return { movieList };
  },
};
</script>