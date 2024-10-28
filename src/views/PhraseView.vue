<template>
  <br/>
  <!--
        <div class="change-order">
        <label for="order">Sortera efter:</label>
        <select class="dropdown" v-model="order" @change="update()">
          <option value="year">År</option>
          <option value="author">Författare</option>
        </select>
      </div>
-->
    <div class="card-container">
<!--
      <div class="littlabbinfo label-color" style="font-size:1.2em; margin-top:4px;">Klicka på ett stycke för att se hela texten hos Litteraturbanken.se</div>
      <div v-if="numExcluded > 0">
        <div class="exclude-label label-color">
          <span class="exclusion-number">{{ numExcluded }} stycke<span v-if="numExcluded > 1">n</span></span> 
          exkludera<span v-if="numExcluded === 1">t</span><span v-if="numExcluded > 1">de</span> på grund av att de<span v-if="numExcluded === 1">t</span> faller utanför vald tidsperiod.
        </div>
      </div>
      -->
      <div class="title-container page-container">
        <h1 class="title">Frassökning: {{ props.phrase }}</h1>
      Vi hittar frasen <i>{{ props.phrase }}</i> i <b>{{ segmentClusters.size }}</b> återbruk.
      </div>
      <div v-if="isEmpty" class="page-container">
          <!--<b>Inga träffar för frasen <i>{{ props.phrase }}</i>.</b>-->
        </div>
        <div v-else>
          <!--
        <phrase-card 
      v-for="segment in segments"
      :segment="segment"
      :phrase="props.phrase"
      :key="segment.id"
    >
    </phrase-card>
    -->
    <cluster-phrase-card
      v-for="segmentCluster in segmentClusters"
      :cluster="segmentCluster"
      :phrase="props.phrase"
      ></cluster-phrase-card>
  </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onBeforeUnmount, onMounted, watch } from 'vue';
  import { search2 } from "@/services/diana";
  import { ref } from "vue";
  import Fuse from "fuse.js";
  // import cluster Phrase card
  import ClusterPhraseCard from "@/components/ClusterPhraseCard.vue";
import { setBusy, setNotBusy } from '@/components/Waiter.vue';
import { searchStore } from '@/stores/search';
import { onBeforeMount } from 'vue';


  const isEmpty = ref(false);
  const store = searchStore();
  const numExcluded = ref<number>(0);
  const props = defineProps<{
    phrase: string;
  }>();
  const segmentClusters = ref<Map<number, any[]>>(new Map());
  const originalSegments = ref<any[]>([]);
  const order = ref<string>("year");
  const sumResults = ref<number>(0);
  const params = {
    phrase: props.phrase,
    depth: 4
  }
  let segments = ref<any[]>([]);
  async function loadData() {
  const data = await search2<any>(params, "phrase_search");
  if (data.count === 0) {
    console.log("No results");
    isEmpty.value = true;
    setNotBusy();
  } else {
    isEmpty.value = false;
  }
  
  originalSegments.value = data.results;

  const options = {
    isCaseInsensitive: true,
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.4,
    ignoreLocation: true,
    keys: ["text"],
  };

  // Perform additional client-side filtering
  // to exclude potential cluster matches
  // that are not exact matches
  const fuse = new Fuse(originalSegments.value, options);
  const result = fuse.search(props.phrase);
  let nseg: any[] = [];
  result.forEach((r) => {
    nseg.push(r.item);
  });
  
  originalSegments.value = nseg;
  
  segments.value = nseg.filter((s) => {
    if (store.yearStart) {
      if (store.yearEnd) {
        if (s.series.imprint_year >= store.yearStart && s.series.imprint_year <= store.yearEnd) {
          return true;
        } else {
          return false;
        }
      } else
        if (s.series.imprint_year >= store.yearStart) {
          return true;
        } else {
          return false;
        }
    } else {
      if (store.yearEnd) {
        if (s.series.imprint_year <= store.yearEnd) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }).sort((a, b) => {
    return a.series.imprint_year - b.series.imprint_year;
  });
  
  // aggregate results by cluster
  

  function aggregateResults() {
    let clusters = new Map();
    for (let i = 0; i < originalSegments.value.length; i++) {
      const segment_i = originalSegments.value[i];
      if (segment_i.cluster) {
        if (clusters.has(segment_i.cluster.id)) {
          clusters.get(segment_i.cluster.id).push(segment_i);
        } else {
          clusters.set(segment_i.cluster.id, [segment_i]);
        }
      }
    }
    return clusters;
  }
  
  segmentClusters.value = aggregateResults();
  // sort segment clusters by size, descending
  segmentClusters.value = new Map([...segmentClusters.value.entries()].sort((a, b) => b[1].length - a[1].length));
  store.phraseResults = segmentClusters.value;
  }

  function filterData() {
    const s = originalSegments.value;
    let includedSegments = [];
    let excludedSegments = [];
    for (let i = 0; i < originalSegments.value.length; i++) {
      const segment_i = originalSegments.value[i];
      if (store.yearStart) {
        if (store.yearEnd) {
          if (segment_i.series.imprint_year >= store.yearStart && segment_i.series.imprint_year <= store.yearEnd) {
            includedSegments.push(segment_i);
          } else {
            excludedSegments.push(segment_i);
          }
        } else {
          if (segment_i.series.imprint_year >= store.yearStart) {
            includedSegments.push(segment_i);
          } else {
            excludedSegments.push(segment_i);
          }
        }
      } else {
        if (store.yearEnd) {
          if (segment_i.series.imprint_year <= store.yearEnd) {
            includedSegments.push(segment_i);
          } else {
            excludedSegments.push(segment_i);
          }
        } else {
          includedSegments.push(segment_i);
        }
      }
    }
    if (excludedSegments.length > 0) {
      console.log("Excluded segments: ", excludedSegments.length);
      numExcluded.value = excludedSegments.length;
    } else {
      numExcluded.value = 0;
    }
    segments.value = s.filter((segment) => {
      if (store.yearStart) {
        if (store.yearEnd) {
          if (segment.series.imprint_year >= store.yearStart && segment.series.imprint_year <= store.yearEnd) {
            return true;
          } else {
            return false;
          }
        } else
          if (segment.series.imprint_year >= store.yearStart) {
            return true;
          } else {
            return false;
          }
      } else {
        if (store.yearEnd) {
          if (segment.series.imprint_year <= store.yearEnd) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    }).sort((a, b) => {
      return a.series.imprint_year - b.series.imprint_year;
    }); 
    update();
  }
  
  function  customBack() {
    setBusy();
    history.back()
  }

  function update() {
    console.log("Update" + order.value);
    if (order.value === "year") {
      segments.value?.sort((a, b) => {
        if (a.series.imprint_year < b.series.imprint_year) {
          return -1;
        }
        if (a.series.imprint_year > b.series.imprint_year) {
          return 1;
        }
        if (a.series.main_author.formatted_name < b.series.main_author.formatted_name) {
          return -1;
        }
        if (a.series.main_author.formatted_name > b.series.main_author.formatted_name) {
          return 1;
        }
        return 0;
      });
    } else if (order.value === "author") {
      segments.value?.sort((a, b) => {
        if (a.series.main_author.formatted_name < b.series.main_author.formatted_name) {
          return -1;
        }
        if (a.series.main_author.formatted_name > b.series.main_author.formatted_name) {
          return 1;
        }
        if (a.series.imprint_year < b.series.imprint_year) {
          return -1;
        }
        if (a.series.imprint_year > b.series.imprint_year) {
          return 1;
        }
        return 0;
      });
    } else {
      console.log("Error. Unknown order value: " + order.value);
    }
  }

  onBeforeUnmount(() => {
    
    //setBusy();
  });

  onBeforeMount(async () => {
    if (!store.phraseResults) {
      await loadData();
    } else {
      segmentClusters.value = store.phraseResults;
    }
  });
  onMounted(() => {
    //setNotBusy();
  });

  watch(
    () => store.yearStart, 
    () => {
      filterData();
    }, 
    {
      immediate: true,
      deep: true
    });

  watch(
    () => store.yearEnd,
    () => {
      filterData();
    },
    {
      immediate: true,
      deep: true
    }
  );
  
  </script>
  
  <style>
  .highlight {
    font-weight: 800;
  }
  </style>
  
  <style scoped>
  .card-container {
    height: 80%;
  }
  .page-container {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-bottom: 3rem;
    line-height: 2rem;
  }
  
  .page-text {
    font-size: 20px;
    line-height: 1.2;
  }
  
  .title-container {
    margin-bottom: 2rem;
  }
  
  .title {
    font-family: "Cormorant Garamond", serif;
    letter-spacing: -3px;
    margin-top: 30px;
     margin-bottom: 10px;
    font-size: 40px;
    line-height: 1.0;
    color: black;
  }
  
  .author {
    font-size: 20px;
    font-weight:500;
  }
  
  .back-button:hover {
    background-color: rgb(80,80,80);
    color: white;
  }
  
  .change-order {
  margin-left: 20px;
  float: right;
  color:black;
  padding-right:40px;

}

.dropdown {
  font-size:1em;
    color: white;
    border-radius: 5px;
    padding: 4px 10px;
    padding-right: 30px;
    margin-left:5px;
    width: auto;
    height: auto;
    background-image: url("@/assets/dropdown-arrow.png");
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) 55%;
    background-color:var(--theme-accent-color);
    -webkit-appearance: none;
    appearance: none;
    /* text-transform: capitalize; */
}

  @media screen and (max-width: 950px) {
    .back-button {
      margin-top: 40px;
      margin-left: 50px;
      font-size: 28px;
      width: 120px;
    }
  }
  </style>
  