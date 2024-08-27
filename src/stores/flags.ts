import { defineStore } from "pinia";

export const flagStore = defineStore("flags", {
    state: () => {
        const flags = {
            hasClusters: false,
        };
    
        return { flags };
      }
});