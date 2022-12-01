<template>
  <div class="cluster-card">
    <div class="cluster-metadata-container">
      <div>
        <p class="cluster-size-label">{{ cluster.size }}</p>
        återbruk i olika verk
      </div>
      <!-- <div>{{ names }}</div> -->
    </div>
    <div class="cluster-text-container">
      {{ cluster.segments[0].text.slice(0, 300) }}...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { list, get } from "@/services/diana";
import type {
  Author,
  Page,
  Work,
  Segment,
  Cluster,
} from "@/types/litteraturlabbet";

const props = defineProps<{
  cluster: Cluster;
}>();
</script>

<style scoped>
.cluster-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 1rem 1rem 1rem 1rem;
  background-color: antiquewhite;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
}

.cluster-text-container {
  width: 70%;
  color: black;
  /* background-color: white; */
  /* opacity: 0.9; */
  padding: 2rem 2rem 2rem 2rem;
  font-style: italic;
}

.cluster-metadata-container {
  width: 30%;
  background-color: sienna;
  color: white;
  padding: 2rem 2rem 2rem 2rem;
  border-radius: 8px 0 0 8px;
  flex-grow: initial;
  font-size: large;
}

.cluster-size-label {
  font-size: xx-large;
}
</style>
