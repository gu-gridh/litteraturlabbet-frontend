<template>
  <div class="reuse-container">
    <div class="reuse-list-label">
      <div class="reuse-label">
        <div v-if="authorSelected && !workSelected">
          I verk av
          <span class="author-name">{{ authorSelected?.name }}</span> finner vi
          {{ clusterCount }} grupper av likartade stycken, så kallade återbruk.
        </div>
        <div v-if="workSelected && authorSelected">
          I verket
          <span class="work-title">{{ workSelected.short_title }}</span>
          av <span class="author-name">{{ authorSelected?.name }}</span> finner
          vi {{ clusterCount }} grupper av återbruk.
        </div>
      </div>
      <v-pagination
        v-model="page"
        :pages="pages"
        :range-size="1"
        active-color="white"
        @update:modelValue="onPageChange"
      />
    </div>

    <div class="card-container">
      <div v-for="cluster in clusters" v-bind:key="cluster.id">
        <cluster-card :cluster="cluster"></cluster-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

import { onBeforeRouteUpdate } from "vue-router";

import { list, get } from "@/services/diana";
import ClusterCard from "@/components/ClusterCard.vue";
import type { Author, Cluster, Work } from "@/types/litteraturlabbet";

const props = defineProps<{
  author: number;
  work?: number;
}>();

// const store = searchStore();
const route = useRoute();
const authorSelected = ref<Author>();
const workSelected = ref<Work>();
const clusters = ref<Array<Cluster>>([]);
const clusterCount = ref<number>(0);
const page = ref(1);
const pages = computed(() => {
  return Math.floor(clusterCount.value / 25) + 1;
});

await fetchData();

async function fetchData() {
  authorSelected.value = await get<Author>(props.author, "author");
  workSelected.value = undefined;
  if (props.work) {
    workSelected.value = await get<Work>(props.work, "work");
  }

  fetchClusters(page.value, authorSelected.value?.id, workSelected.value?.id);
}

function fetchClusters(
  page: number,
  authorID: number | undefined,
  workID: number | undefined
) {
  const params = {
    has_author: authorID,
    work: workID,
    limit: 25,
    offset: 25 * (page - 1),
  };

  list<Cluster>("cluster", params).then((d) => {
    clusters.value = d.results;
    clusterCount.value = d.count;
  });
}

function onPageChange() {
  fetchClusters(page.value, authorSelected.value?.id, workSelected.value?.id);
}

watch(
  () => route.params,
  async (params) => {
    fetchData();
  },
  {
    immediate: true,
    deep: true,
  }
);

// watch(
//   () => route.params,
//   async (params) => {

//     if (params.author) {
//         authorSelected.value = await get<Author>(params.author, "author");
//     }

//     if (params.work) {
//         workSelected.value = await get<Work>(params.work, "work");
//     }

//   },
//   { immediate: true }
// );

// watch(
//   () => route.params.work,
//   async (workID) => {
//     workSelected.value = await get<Work>(Number(workID), "work");
//   },
//   { immediate: true }
// );
</script>

<style scoped>
.card-container {
  overflow-y: scroll;
  height: 100%;
}

.reuse-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reuse-list-label {
  display: flex;
  margin-left: 1rem;
  margin-bottom: 2rem;
  background-color: white;
  color: black;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
}

.reuse-label {
  line-height: 2.5rem;
  max-width: 65%;
}

.author-name,
.work-title {
  background-color: purple;
  color: white;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border-radius: 8px;
}
</style>
