<template>
  <div class="reuse-container">
    <suspense>
      <network-chart :author="author"></network-chart>
    </suspense>
    <suspense>
      <reuse-list v-if="author" :author="author" :work="work"></reuse-list>
    </suspense>
  </div>
</template>

<script setup lang="ts">
import NetworkChart from "@/components/NetworkChart.vue";
import ReuseList from "@/components/ReuseList.vue";

defineProps<{
  author?: number;
  work?: number;
}>();
</script>

<style scoped>
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
}

.author-name,
.work-title {
  background-color: rgb(182, 82, 139);
  color: white;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  border-radius: 8px;
}
</style>
