<template>
    <div class="card-container">
      <div class="back-button" onclick="history.back()">Tillbaka</div>
  
      <div v-if="isEmpty" class="page-container">
          <b>Inga träffar för frasen <i>{{ props.phrase }}</i>.</b>
          <!-- To hide the loading animation, insert breaks -->
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
        <div v-else>
        <phrase-card 
      v-for="segment in segments"
      :segment="segment"
      :phrase="props.phrase"
    >
    </phrase-card>
  </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import { search2 } from "@/services/diana";
  import PhraseCard from "@/components/PhraseCard.vue";
  import { ref } from "vue";
  import Fuse from "fuse.js";

  const isEmpty = ref(false);

  
  const props = defineProps<{
    phrase: string;
  }>();

  const params = {
    phrase: props.phrase,
    depth: 4
  }

  const data = await search2<any>(params, "phrase_search");
  if (data.count === 0) {
    console.log("No results");
    isEmpty.value = true;
  } else {
    isEmpty.value = false;
  }
  let segments = data.results;

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
  const fuse = new Fuse(segments, options);
  const result = fuse.search(props.phrase);
  let nseg: any[] = [];
  result.forEach((r) => {
    nseg.push(r.item);
  });
  segments = nseg;
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
  