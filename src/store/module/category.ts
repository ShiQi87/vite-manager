import { reqCategory01, reqCategory02, reqCategory03 } from "@/api/product/attr";
import { defineStore } from "pinia";
import { CategoryState } from "../type";

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Id: '',
      c1Attr: [],
      c2Id: '',
      c2Attr: [],
      c3Id: '',
      c3Attr: [],
    }
  },
  actions: {
    async getC1() {
      const result = await reqCategory01();
      if (result.code == 200) {
        this.c1Attr = result.data;
      }
    },
    async getC2() {
      const result = await reqCategory02(this.c1Id);
      if (result.code == 200) {
        this.c2Attr = result.data;
      }
    },
    async getC3() {
      const result = await reqCategory03(this.c2Id);
      if (result.code == 200) {
        this.c3Attr = result.data;
      }
    }
  },
  getters: {}
});

export default useCategoryStore;