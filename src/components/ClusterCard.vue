<template>
   <router-link
          :to="{
            name: 'cluster',
            params: {
              id: cluster.id,
            },
          }"
          >
  <div class="cluster-card">
    <div class="cluster-metadata-container">
      <div>
        <p class="cluster-size-label">{{ cluster.size }} textåterbruk</p> 
       
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
</template>

<script setup lang="ts">
import type { Cluster } from "@/types/litteraturlabbet";

defineProps<{
  cluster: Cluster;
}>();
</script>

<style scoped>
.cluster-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 0rem 1rem 1rem 1rem;
  height: 6.5rem;
  background-color: pink;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
}

.cluster-text-container {
  width: calc(100% - 180px);
  color: black;
  /* background-color: white; */
  /* opacity: 0.9; */
  padding: 1rem 1rem 1rem 1rem;
  font-style: normal;
}

.cluster-metadata-container {
  width: 180px;
  background-color: purple;
  color: white;
  padding: 2rem 1rem 1rem 1rem;
  border-radius: 8px 0 0 8px;
  flex-grow: initial;
  font-size: large;
}

.cluster-size-label {
  font-size: x-large;
}
</style>
