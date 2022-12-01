<template>
  <div class="reuse-container">
    <div class="reuse-list-label">
      <div class="reuse-label">
        <div v-if="store.author && !store.work">
          I verk av
          <span class="author-name">{{ store.author.name }}</span> finner vi
          {{ clusterCount }} grupper av likartade stycken, så kallade återbruk.
        </div>
        <div v-if="store.author && store.work">
          I verket
          <span class="work-title">{{ store.work.short_title }}</span>
          av <span class="author-name">{{ store.author.name }}</span> finner vi
          {{ clusterCount }} grupper av återbruk.
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
import { ref, watch, computed, onMounted } from "vue";
import { list } from "@/services/diana";
import ClusterCard from "@/components/ClusterCard.vue";
import type { Cluster } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";

const store = searchStore();
const clusters = ref<Array<Cluster>>([]);
const clusterCount = ref<number>(0);
const page = ref(1);
const pages = computed(() => {
  return clusterCount.value / 25 + 1;
});

function fetchClusters(page: number) {
  const params = {
    has_author: store.author?.id,
    work: store.work?.id,
    limit: 25,
    offset: 25 * (page - 1),
  };

  list<Cluster>("cluster", params).then((d) => {
    clusters.value = d.results;
    clusterCount.value = d.count;
  });
}

function onPageChange() {
  fetchClusters(page.value);
}

watch(
  () => [store.author, store.work],
  () => fetchClusters(page.value),
  {
    deep: true,
  }
);

onMounted(() => {
  fetchClusters(page.value);
});
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
  background-color: saddlebrown;
  color: white;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  border-radius: 8px;
}
</style>
