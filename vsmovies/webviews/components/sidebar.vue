<template>
  <div>
    <div v-if="isAuthenticated">
      <h3>YOU ARE AUTHENTICATED!</h3>
      <button @click="logout">Logout</button>
    </div>
    <button v-else @click="login">Login with Github</button>
    <div class="mg-top">
      <label>search</label>
      <input type="text" v-model="enteredSearchTerm" />
      <button @click="getSearchedResults">search</button>
    </div>
    <div class="mg-top">
      <label>search by genres</label>
      <input type="text" v-model="enteredText" />
      <button @click="getResults">search</button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const enteredText = ref("");
    const enteredSearchTerm = ref("");
    const token = ref("");
    const isAuthenticated = ref(false);

    const store = useStore();

    const login = () => {
      tsVscode.postMessage({ type: "authenticate" });
    };

    const logout = () => {
      store.dispatch("auth/logout");
      isAuthenticated.value = store.getters["auth/isAuthenticated"];
      tsVscode.postMessage({ type: "logout" });
    };

    const getResults = () => {
      tsVscode.postMessage({
        type: "set-movie-store",
        value: enteredText.value,
      });
    };

    const getSearchedResults = () => {
      tsVscode.postMessage({
        type: "set-searched-movie-store",
        value: enteredSearchTerm.value,
      });
    };

    onMounted(async () => {
      window.addEventListener("message", async (event) => {
        const message = event.data;
        switch (message.type) {
          case "token":
            token.value = message.value;
            try {
              await store.dispatch("auth/login", { token: token.value });
            } catch (err) {
              throw new Error(err.message || "Failed to authenticate");
            }

            isAuthenticated.value = store.getters["auth/isAuthenticated"];
            break;
        }
      });

      tsVscode.postMessage({ type: "get-token" });
    });

    return {
      enteredText,
      isAuthenticated,
      login,
      logout,
      getResults,
      enteredSearchTerm,
      getSearchedResults,
    };
  },
};
</script>

<style>
.mg-top {
  margin-top: 20px;
}
label {
  font-weight: bold;
  font-size: 15px;
  color: var(--vscode-button-background);
}
</style>