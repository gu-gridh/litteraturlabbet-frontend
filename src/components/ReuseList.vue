<template>
  <div class="reuse-list-label">
    <div class="reuse-label">
      <div v-if="authorSelected && !workSelected">
        I verk av
        <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        {{ clusterCount }} grupper av likartade stycken.
      </div>
      <div v-if="workSelected && authorSelected">
        I verket
        <span class="work-title">{{ workTitle }}</span>
        av <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        {{ clusterCount }} grupper av återbruk.
      </div>
    </div>
       <div class="pagination">
    <v-pagination
      v-model="page"
      :pages="pages"
      :range-size="1"
      active-color="white"
      @update:modelValue="onPageChange"
    />
  </div>
    </div>
  

  <div class="card-container">
    <div v-for="cluster in clusters" v-bind:key="cluster.id">
      <cluster-card :cluster="cluster"></cluster-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
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
const workTitle = ref<string>("");
const clusters = ref<Array<Cluster>>([]);
const clusterCount = ref<number>(0);
const page = ref(1);
const pages = computed(() => {
  return Math.floor(clusterCount.value / 25) + 1;
});

await fetchData(props.author, props.work);

async function fetchData(author: number, work?: number) {
  if (author) {
    authorSelected.value = await get<Author>(author, "author");
    workSelected.value = undefined;
  }

  if (work) {
    workSelected.value = await get<Work>(work, "work");
    workTitle.value = workSelected.value.short_title
      ? workSelected.value.short_title
      : workSelected.value.title;
  }

  if (author) {
    await fetchClusters(page.value, author, work);
  }
}

async function fetchClusters(
  page: number,
  authorID: number | undefined,
  workID: number | undefined
) {
  const params = {
    has_author: authorID,
    work: workID,
    limit: 10,
    offset: 10 * (page - 1),
  };

  const clusterResults = await list<Cluster>("cluster", params);
  clusters.value = clusterResults.results;
  clusterCount.value = clusterResults.count;
}

async function onPageChange() {
  await fetchClusters(
    page.value,
    authorSelected.value?.id,
    workSelected.value?.id
  );
}

watch(
  () => props.author,
  async (newAuthor, oldAuthor) => {
    console.log(newAuthor, oldAuthor);
    await fetchData(props.author, props.work);
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.work,
  async (newWork, oldWork) => {
    await fetchData(props.author, props.work);
  },
  {
    immediate: true,
    deep: true,
  }
);


// watch(
//   [props.author, props.work],
//   async ([newAuthor, oldAuthor], [newWork, oldWork]) => {
//     console.log(newAuthor, oldAuthor, newWork, oldWork);
//     await fetchData(props.author, props.work);
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );

// watch(
//   [props.author, props.work],
//   async ([newAuthor, oldAuthor], [newWork, oldWork]) => {
//     console.log(newAuthor, oldAuthor, newWork, oldWork);
//     await fetchData(props.author, props.work);
//   },
//   {
//     immediate: true,
//     deep: true,
//   }
// );
</script>

<style scoped>
.card-container {
  height: 100%;
}

.reuse-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reuse-list-label {
  display: flex;
  margin-left: 0rem;
  margin-bottom: 2rem;
  background-color: white;
  color: black;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 0px;
  flex-direction: row;
  justify-content: space-between;

}

.reuse-label {
  line-height: 2.5rem;
  max-width: 85%;
  font-size: 17px;
  line-height:1.5 !important;
}

.author-name,
.work-title {
  background-color: rgb(182, 82, 139);
  color: white;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  border-radius: 8px;
}

  @media screen and (max-width: 950px) {
    .reuse-label {
  line-height: 2.5rem;
  font-size: 21px;  
  max-width: 100%;

}
.reuse-list-label {
  height: 100%;
  display: block;
  margin-bottom:30px;
}
.pagination {
  float:right;
  margin-right:30px;
  margin-top:20px;
}
  }

</style>
