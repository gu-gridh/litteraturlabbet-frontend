<template>
    <div class="card-container">
      <div style="margin-left:2.6em; font-size:1.2em; margin-top:50px; color:black;">Klicka på ett stycke för att se hela texten hos Litteraturbanken.se</div>
  
      <div v-if="isEmpty" class="page-container">
          <b>Inga träffar för frasen <i>{{ props.phrase }}</i>.</b>
        </div>
        <div v-else>
        <phrase-card 
      v-for="segment in segments"
      :segment="segment"
      :phrase="props.phrase"
      :key="segment.id"
    >
    </phrase-card>
  </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, onBeforeUnmount, onMounted, watch } from 'vue';
  import { search2 } from "@/services/diana";
  import PhraseCard from "@/components/PhraseCard.vue";
  import { ref } from "vue";
  import Fuse from "fuse.js";
import { setBusy, setNotBusy } from '@/components/Waiter.vue';
import { searchStore } from '@/stores/search';


  const isEmpty = ref(false);
  const store = searchStore();
  
  const props = defineProps<{
    phrase: string;
  }>();

  const params = {
    phrase: props.phrase,
    depth: 4
  }
  let segments = ref<any[]>([]);

  const data = await search2<any>(params, "phrase_search");
  if (data.count === 0) {
    console.log("No results");
    isEmpty.value = true;
  } else {
    isEmpty.value = false;
  }
  
  let originalSegments = data.results;

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
  const fuse = new Fuse(originalSegments, options);
  const result = fuse.search(props.phrase);
  let nseg: any[] = [];
  result.forEach((r) => {
    nseg.push(r.item);
  });
  
  originalSegments = nseg;
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
  

  function filterData() {
    // This code constantly produces loading animations
    /*
    const s = originalSegments;
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
    */
  }
  
  function  customBack() {
    setBusy();
    history.back()
  }

  onBeforeUnmount(() => {
    console.log("OBU");
    setBusy();
  });

  onMounted(() => {
    setNotBusy();
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
  
  @media screen and (max-width: 950px) {
    .back-button {
      margin-top: 40px;
      margin-left: 50px;
      font-size: 28px;
      width: 120px;
    }
  }
  </style>
  