<template>
  <div class="l-container">
    <div class="l-card-flex">
      <div class="b-game-card">
        <div
          class="b-game-card__cover"
          :style="{ backgroundImage: `url(${poster})` }"
        ></div>
      </div>
      <h3>{{ name }}</h3>
      <button @click="seeCast">
        {{ !resetCast ? "See cast details" : "Hide cast details" }}
      </button>
    </div>
    <sub-base-card
      v-for="cast of castList"
      :key="cast.id"
      :name="cast.name"
      :image="cast.image"
    ></sub-base-card>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  props: ["name", "poster", "id"],
  setup(props) {
    const store = useStore();

    const castList = ref([]);
    const resetCast = ref(false);

    const seeCast = async () => {
      if (!resetCast.value) {
        await store.dispatch("cast/getCast", { id: props.id });
        castList.value = store.getters["cast/casts"];
        resetCast.value = true;
      } else {
        await store.dispatch("cast/resetCast");
        castList.value = store.getters["cast/casts"];
        resetCast.value = false;
      }
    };

    return { seeCast, castList, resetCast };
  },
};
</script>