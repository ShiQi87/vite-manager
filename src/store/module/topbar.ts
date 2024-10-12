import { defineStore } from "pinia";

let useTopbarStore = defineStore('Topbar', {
  state() {
    return {
      fold: false,
      refresh: false
    }
  }
});

export default useTopbarStore;