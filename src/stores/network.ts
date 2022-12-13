import { ref } from "vue";
import { defineStore } from "pinia";
import type { Link, Node } from "@/types/network";

export const networkStore = defineStore("network", {
  state: () => {
    // const links = 
    // const nodes = ref<Array<Node>>();
    const data = {
      links: ref<Array<Link>>(),
      nodes: ref<Array<Node>>()
    }

    return { data };
  }
});
