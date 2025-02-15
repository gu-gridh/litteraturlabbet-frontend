import { ref, computed } from "vue";
import { defineStore } from "pinia";
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
    const author2 = ref<Author | undefined>(undefined);
    const work = ref<Work | undefined>(undefined);
    const page = ref<Page | undefined>(undefined);
    const cluster = ref<Cluster | undefined>(undefined);
    const segment = ref<Segment | undefined>(undefined);
    const phrase = ref<string | undefined>(undefined);
    const yearStart = ref<number | undefined>(undefined);
    const yearEnd = ref<number | undefined>(undefined);
    const phraseResults = ref<any>();
    const selfReuse = ref<boolean>(true);
    const triggerImageSearch = ref(false);
    const clusters = ref<Cluster[]>([]);
    const clusterCount = ref<number>(0);
    const chronoData = ref<any>();
    const chronographByAuthor = ref<any>();
    const chronographByYear = ref<any>();
    const currentPage = ref<number>(1); //track the current page
    const imageOrder = ref<string>("ASC");
    const imageTag = ref<string | undefined>(undefined);
    return { author, author2, work, page, cluster, segment, phrase, yearStart, yearEnd, triggerImageSearch, phraseResults, selfReuse, clusters, clusterCount, chronoData, chronographByAuthor, chronographByYear, currentPage, imageOrder, imageTag };
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

      if (state.phrase) {
        path += "&phrase=" + state.phrase;
      }

      return path;
    },
  },
});
