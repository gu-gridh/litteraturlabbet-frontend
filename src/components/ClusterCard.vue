<template>
  <div class="text-container" v-if="cluster.size===0">
  </div>
  <div v-else>
   <router-link
          :to="{
            name: 'cluster',
            params: {
              id: cluster.id,
              author: store.author?.id,
            },
          }"
          >
  <div class="cluster-card">
    <div class="cluster-metadata-container">
      <div>
        <p class="cluster-size-label">{{ Math.max(0,cluster.size - cluster.selfReuseCount) }} </p> hos andra
      </div>
      <div>
        <p class="cluster-size-label">{{ cluster.selfReuseCount }} </p> hos författaren
      </div>
      
      <div>
        <!-- <router-link
          :to="{
            name: 'cluster',
            params: {
              id: cluster.id,
            },
          }"
          >Utforska</router-link
        > -->
      </div>
    </div>
   
    
    <div class="cluster-text-container">
      {{ cluster.segments[0].text.slice(0, 300) }}...
    </div>
  </div>
  </router-link
        >
      </div>
</template>

<script setup lang="ts">
import type { Cluster } from "@/types/litteraturlabbet";

// init store
import { searchStore } from "@/stores/search";
import { watch } from "vue";

const store = searchStore();
const props = defineProps<{
  cluster: Cluster;
}>();

watch(() => props.cluster.selfReuseCount, () => {
  console.log("selfReuseCount changed");
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
  width: 260px;
  height:85px;
  line-height:1.1;
  text-align:center;
  color: black;
  padding: 1rem 1rem 1rem 1rem;

  flex-grow: initial;
  font-size: large;
  transition: all .2s ease-in-out;
  margin-left:10px;
  display:flex;
  flex-direction: row;
  gap:20px;
  border-width: 0px 0.5px 0 0;
  border-style:dashed;
  border-color:black
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
