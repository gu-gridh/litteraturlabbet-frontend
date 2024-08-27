<template>
  <div class="reuse-container">
  <div class="reuse-list-label">
    <div class="">
      <div v-if="authorSelected && !workSelected">
        I verk av
        <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        <span class="author-name">{{ clusterCount }}</span> grupper av likartade stycken.
        <br/>

      </div>
      <div v-if="workSelected && authorSelected">
        I verket
        <span class="work-title">{{ workTitle }}</span>
        av <span class="author-name">{{ authorSelected?.name }}</span> finner vi
        <span class="work-title"> {{ clusterCount }} </span> grupper av återbruk.
      </div>
    </div>
  
    </div>

  </div>
  <div class="reuse-works">
    <!-- Show works included in search on request -->
    <div class="show-works">
      <div v-show="showWorks">
        <span class="mouse-pointer" @click="toggleShowWork()">Dölj verk</span>
        <ChronoGraph :author="authorSelected?.id" :work="workSelected?.id"></ChronoGraph>
      </div>
      <span v-show="!showWorks" class="mouse-pointer" @click="toggleShowWork()">Visa vilka verk som ingår i sökningen</span>
    </div>
  </div>
  <div class="card-container">
    <div v-for="cluster in clusters" v-bind:key="cluster.id">
      <cluster-card :cluster="cluster"></cluster-card>
    </div>
  </div>
  <div class="pagination">
    <v-pagination
      v-model="page"
      class="pagination-numbers"
      :pages="pages"
      :range-size="5"
      active-color="rgb(200,200,200)"
      @update:modelValue="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { list, get } from "@/services/diana";
import ClusterCard from "@/components/ClusterCard.vue";
import type { Author, Cluster, Work } from "@/types/litteraturlabbet";
import { setBusy, setNotBusy } from "./Waiter.vue";
import { searchStore } from "@/stores/search";
import ChronoGraph from "./ChronoGraph.vue";

const props = defineProps<{
  author: number;
  work?: number;
}>();

const store = searchStore();
const route = useRoute();
const authorSelected = ref<Author>();
const workSelected = ref<Work>();
const workTitle = ref<string>("");
const clusters = ref<Array<Cluster>>([]);
const clusterCount = ref<number>(0);
const page = ref(1);
const pages = computed(() => {
  return Math.floor(clusterCount.value / 10) + 1;
});
const numExcluded = ref<number>(0);
const showWorks = ref(false);

// only fetch data if no data in store
if (store.clusters && store.clusters.length > 0) {
  clusters.value = store.clusters;
  clusterCount.value = store.clusterCount;
} else {
  await fetchData(props.author, props.work);
}
function toggleShowWork() {
  showWorks.value = !showWorks.value;
}

async function fetchData(author: number, work?: number) {
  if (route.path.match(/\/reuse\/\d+(\/\d+)?$/)) {
    if (author) {
      if (authorSelected.value?.id !== author) {
        authorSelected.value = await get<Author>(author, "author");
        workSelected.value = undefined;
      }
      //authorSelected.value = await get<Author>(author, "author");
      //workSelected.value = undefined;
    }

    if (work) {
      if (workSelected.value?.id !== work) {
        workSelected.value = await get<Work>(work, "work/19th_century");
        workTitle.value = workSelected.value.short_title
          ? workSelected.value.short_title
          : workSelected.value.title;
      }
      /*workSelected.value = await get<Work>(work, "work/19th_century");
      workTitle.value = workSelected.value.short_title
        ? workSelected.value.short_title
        : workSelected.value.title;*/
    }

    if (author) {
      await fetchClusters(page.value, author, work);
    }
  }
}

async function fetchClusters(page: number, authorID: number | undefined, workID: number | undefined) {
  if (!route.path.match(/\/reuse\/\d+(\/\d+)?$/)) {
    return;
  }
  // try reusing cluster values
  if (store.clusters && store.clusters.length > 0) {
    console.log("Cluster reuse");
    clusters.value = store.clusters;
    clusterCount.value = store.clusterCount;
    return;
  }
  //setBusy();
  const params = {
    has_author: authorID,
    work: workID,
    limit: 10,
    offset: 10 * (page - 1),
    depth: 2,
    year_start: store.yearStart,
    year_end: store.yearEnd,
  };

  const clusterResults = await list<Cluster>("cluster", params);
  
  clusterResults.results.forEach((cluster) => {
    
    let seenSegmentIds = new Set();
    
    for (let i = 0; i < cluster.segments.length; i++) {
      const segment_i = cluster.segments[i];
      // exclude segments that are below the yearStart and above yearEnd threshold
      if (store.yearStart) {
        if (segment_i.series.imprint_year < store.yearStart) {
          // splice out the value
          cluster.segments.splice(i, 1);
          continue;
        }
      }
      if (store.yearEnd) {
        if (segment_i.series.imprint_year > store.yearEnd) {
          cluster.segments.splice(i, 1);
          continue;
        }
      }
      const gid = segment_i.gid;
      if (seenSegmentIds.has(gid)) {
        cluster.segments.splice(i, 1);
        i--;
      } else {
        seenSegmentIds.add(gid);
      }
    }
    
    //cluster.segments = cluster.segments.filter((s) => s.series.imprint_year >= store.yearStart && s.series.imprint_year <= store.yearEnd);
    let excludedSegments = [];
    let includedSegments = [];
    for (const el of cluster.segments) {
      if (store.yearStart) {
        if (store.yearEnd) {
          if (el.series.imprint_year >= store.yearStart && el.series.imprint_year <= store.yearEnd) {
            includedSegments.push(el);
          } else {
            excludedSegments.push(el);
          }
        } else {
          if (el.series.imprint_year >= store.yearStart) {
            includedSegments.push(el);
          } else {
            excludedSegments.push(el);
          }
        }
      } else {
        if (store.yearEnd) {
          if (el.series.imprint_year <= store.yearEnd) {
            includedSegments.push(el);
          } else {
            excludedSegments.push(el);
          }
        } else {
          includedSegments.push(el);
        }
      }
      
    }
    cluster.segments = includedSegments;
    if (excludedSegments.length > 0) {
      numExcluded.value = excludedSegments.length;
    } else {
      numExcluded.value = 0;
    }
    cluster.size = cluster.segments.length;
    if (cluster.segments.length === 0) {
      clusterResults.results.splice(clusterResults.results.indexOf(cluster), 1);
    }
  });
  
  // for each cluster, count number of segments where the main author is the same as the author selected
  clusterResults.results.forEach((cluster) => {
    let count = 0;
    cluster.segments.forEach((segment) => {
      if ((<any>segment.series.main_author) as number === store.author?.id) {
        count++;
      }
    });
    cluster.selfReuseCount = count;
  });

  clusters.value = clusterResults.results.sort((a, b) => b.size - a.size);
  store.clusters = clusters.value;
  
  //clusterCount.value = clusterResults.results.map((c) => c.segments.length).length;
  clusterCount.value = clusterResults.count;
  store.clusterCount = clusterCount.value;
  //setNotBusy();
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

watch(
  () => store.yearStart,
  async (newYearStart, oldYearStart) => {
    await fetchData(props.author, props.work);
  },
  {
    immediate: true,
    
  }
);

watch(
  () => store.yearEnd,
  async (newYearEnd, oldYearEnd) => {
    await fetchData(props.author, props.work);
  },
  {
    immediate: true,
    
  }
);

onMounted(() => {
  setNotBusy();
});

onBeforeUnmount(() => {
  setBusy();
});
</script>

<style scoped>
.mouse-pointer 
{
  cursor: pointer;
  padding:8px 10px;
  border-radius:8px;
  background-color:rgb(240,240,240);
}

.mouse-pointer:hover
{
  background-color:rgb(220,220,220);
}
.card-container {
  height: 100%;
  padding-top:30px;
}

.reuse-container {
  width:100%!important;
}

.reuse-list-label { 
  pointer-events:none;
  margin-bottom: 1rem;
  color: black;
  padding: 1rem;
  padding-top:1rem;
  border-radius: 0px;
  font-size: 19px;
  text-align:center;
  line-height: 2.5rem;
  pointer-events:none;
  position:relative;
width:auto;
line-height:1.5 !important;
}

.reuse-works {
  color: black;
  border-radius: 0px;
  font-size: 16px;
  text-align:center;
  position:relative;
  width:auto;
  line-height:1.5 !important;
}

.exclude-label {
  pointer-events:none;
  position:relative;
  line-height: 2.5rem;
  font-size: 19px;
  text-align:center;
  width:auto;
  line-height:1.5 !important;
}

.pagination {
  margin-top:20px;
  margin-bottom: 1rem;
  width:100%;
}

.pagination-numbers {
  display:flex;
  flex-direction:row;
 justify-content:center;
  width:100%;
}

  @media screen and (max-width: 950px) {
    .reuse-label {
  line-height: 2.5rem;
  font-size: 21px;  

}
.reuse-list-label {
  height: 100%;
  margin-bottom:30px;
}
.pagination {
  margin-right:30px;
  margin-top:20px;
}
  }

</style>
