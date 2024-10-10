import { defineStore } from "pinia";

let useBreadcrumbStore = defineStore('Breadcrumb', {
  state() {
    return {
      fold: false,
    }
  }
});

export default useBreadcrumbStore;