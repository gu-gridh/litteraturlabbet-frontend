import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import type {
  Work,
  Page,
  Author,
  Cluster,
  Segment,
} from "@/types/litteraturlabbet";

export const searchStore = defineStore("search", {
  state: () => {
    const author = ref<Author | undefined>(undefined);
    const work = ref<Work | undefined>(undefined);
    const page = ref<Page | undefined>(undefined);
    const cluster = ref<Cluster | undefined>(undefined);
    const segment = ref<Segment | undefined>(undefined);

    return { author, work, page, cluster, segment };
  },
  getters: {
    paramsPath(state) {
      let path = `?`;

      if (state.author) {
        path += `&author=${state.author.id}`;
      }

      if (state.work) {
        path += `&work=${state.work.id}`;
      }

      return path;
    },
  },
});
