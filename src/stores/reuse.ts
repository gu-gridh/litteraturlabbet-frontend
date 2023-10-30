import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  Work,
  Page,
  Author,
  Cluster,
  Segment,
} from "@/types/litteraturlabbet";
import { update } from "lodash";

export const reuseStore = defineStore("reuse", {
    state: () => {
        const author1 = ref(<number>0);
        const author2 = ref(<number>0);

        function updateAuthor1(author: number) {
            author1.value = author;
        }

        function updateAuthor2(author: number) {
            author2.value = author;
        }

        return { author1, author2, updateAuthor1, updateAuthor2 };
    }

    
})