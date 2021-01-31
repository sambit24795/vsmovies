<template>
  <div class="l-card-flex">
    <div class="b-game-card">
      <div
        class="b-game-card__cover"
        :style="{ backgroundImage: `url(${image})` }"
      ></div>
    </div>
    <h3>{{ name }}</h3>
  </div>
</template>

<script>
export default {
  props: ["name", "image"],
};
</script>