<template>
    <div class="card-container">
  <Suspense>
    <segment-card
      v-for="segment in segments"
      v-bind:key="segment.id"
      :segment="segment"
    ></segment-card>
  </Suspense>
</div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { list, get } from "@/services/diana";
import SegmentCard from "@/components/SegmentCard.vue";
import type {
  Author,
  Page,
  Work,
  Segment,
  Cluster,
} from "@/types/litteraturlabbet";

const props = defineProps<{
  id: number;
}>();

const cluster = ref<Cluster>();
const segments = ref<Array<Segment>>();

onBeforeMount(() => {
  get<Cluster>(props.id, "cluster").then((c) => {
    cluster.value = c;
    segments.value = c.segments;
  });
});
</script>

<style scoped>
.card-container {
    height: 80%;
    overflow-y: scroll;
}
</style>