<template>
  <!--<div class="text-container" v-if="cluster.size===0">
  </div>
  -->
  <!--<div v-else>-->
   <router-link
          :to="{
            name: 'cluster',
            params: {
              id: clusterId,
              phrase: phrase,
              author: 0,
            },
          }"
          >
  <div class="cluster-card">
    <div class="cluster-metadata-container">
      <div>
        <p class="cluster-size-label">{{ clusterSize }} </p> återbruk
      </div>
      <div>
      </div>
    </div>
    <div class="cluster-text-container">
<!--      {{ text.slice(0, 300) }}...-->
      <div class="page-text" v-html="text"></div>
    </div>
  </div>
  </router-link>
</template>

<script setup lang="ts">
import type { Segment } from '@/types/litteraturlabbet';
import { Fuzzy } from '@nexucis/fuzzy';
import { onMounted } from 'vue';
import {ref, defineProps} from 'vue';
import { setNotBusy } from './Waiter.vue';

const props = defineProps<{
  cluster: any;
  phrase: string;
}>();
const clusterId = ref<number>(0);
const clusterSize = ref<number>(0);
const segment = ref<Segment>();
const text = ref<string>("");

if (props) {
  clusterId.value = props.cluster[0];
  clusterSize.value = props.cluster[1].length;
  segment.value = props.cluster[1][0];

  // identify the index of the target phrase in the text
  let index = segment.value!.text.toLowerCase().indexOf(props.phrase.toLowerCase());
  
  if (index === -1) {
    console.log("Phrase not found in segment text");
    index = segment.value!.text.indexOf(props.phrase.split(" ")[0]);
    if (index === -1) {
      index = 0;
    }
  }
  // set the text to include the phrase and up to 50 characters before and 250 characters after the phrase
  text.value = segment.value!.text.slice(Math.max(0,index-50), Math.min(index+250, segment.value!.text.length));

  // highlight phrase in text
  const fuz = new Fuzzy({pre: "<span class='highlight'>", post: "</span>"});
  
  // Original highlighter

  text.value = text.value.replace(
      props.phrase,
      `<span class="highlight">${props.phrase}</span>`
  );
  // v3 better highlighter
  const matches = fuz.filter(props.phrase, [text.value]);
  if (matches.length > 0) {
    text.value = matches[0].rendered;
  }
}

onMounted(() => {
  setNotBusy();
});
</script>

<style scoped>
.cluster-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 0rem 1rem 1rem 1rem;
  height: 6rem;
  display: flex;
  flex-direction: row;
  cursor:pointer;
  transition: all .2s ease-in-out;
}

.cluster-card:hover {
 transform: scale(1.01);
}

.cluster-text-container {
  width: calc(100% - 150px);
  color: black;
  cursor:pointer;
  border-radius: 10px;
  line-height:1.2;
  padding: 1rem 1rem 1rem 2rem;
  font-style: normal;
  font-size:18px;
   display: flex;
  align-items: center;
  cursor:pointer;
}



.cluster-metadata-container {
  width: 95px;
  height:95px;
  line-height:1.1;
  background-color: var(--theme-main-color);
  text-align:center;
  color: white;
  padding: 1.4rem 1rem 1rem 1rem;
  border-radius: 50%;
  flex-grow: initial;
  font-size: large;
  transition: all .2s ease-in-out;
  margin-left:20px;
}

.cluster-metadata-container:hover {
 transform: scale(1.02);
 background-color:var(--theme-main-color-dark);
 
}

.cluster-size-label {
  font-size: 30px;
}

 @media screen and (max-width: 1150px) {


      .cluster-card {

 margin: 1rem 1rem 5rem 1rem;
 }
 }

  @media screen and (max-width: 950px) {

      .cluster-card {

 margin: 1rem 1rem 5rem 1rem;
  

}

  .cluster-text-container {
      font-size:22px;
  }

  .cluster-size-label {
  font-size: 35px;
}

.cluster-metadata-container {
  width: 120px;
  height:120px;
  margin-top:-0.5em;
  line-height:1.1;
  padding: 1.9rem 1rem 1rem 1rem;

}

 }

</style>
