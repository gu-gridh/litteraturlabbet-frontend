<template>
  <div class="reuse-container">
    <suspense>
      <network-chart :author="author"></network-chart>
    </suspense>
    <reuse-list
      v-if="author || work"
      :author="author"
      :work="work"
    ></reuse-list>
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

</style>
