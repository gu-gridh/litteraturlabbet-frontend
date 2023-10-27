<template>
  <div class="card-container">
      <div class="back-button" @click="customBack()">Tillbaka</div>
      <div class="littlabbinfo">Klicka på ett stycke för att se hela texten på Litteraturbanken</div>
    <Suspense>
      <segment-card v-for="segment in segments" v-bind:key="segment.id" :segment="segment"></segment-card>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { list, get } from "@/services/diana";
import SegmentCard from "@/components/SegmentCard.vue";
import type {
  Author,
  Page,
  Work,
  Segment,
  Cluster,
} from "@/types/litteraturlabbet";
import { setBusy } from "@/components/Waiter.vue";

const props = defineProps<{
  id: number;
}>();

const cluster = ref<Cluster>();
let segments = ref<Array<Segment>>();


onBeforeMount(() => {
  get<Cluster>(props.id, "cluster", 4).then((c) => {
    let seenSegmentIds = new Set();
    for (let i = 0; i < c.segments.length; i++) {
      const segment_i = c.segments[i];
      const gid = segment_i.gid;
      if (seenSegmentIds.has(gid)) {
        c.segments.splice(i, 1);
        i--;
      } else {
        seenSegmentIds.add(gid);
      }
    }
    c.size = 0;//c.size - seenSegmentIds.size + 1;
    cluster.value = c;
    segments.value = c.segments.sort((a, b) => {
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
  });
});
function customBack() {
  setBusy();
  history.back();
}

onBeforeUnmount(() => {
  setBusy();
});
</script>

<style scoped>
.card-container {
  height: 80%;
  overflow-y: scroll;
}

.back-button:hover {
  background-color: rgb(120, 120, 120);
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