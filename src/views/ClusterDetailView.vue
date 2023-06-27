<template>

    <div class="card-container">
  
        <div class="back-button" onclick="history.back()">Tillbaka</div>

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
    console.log('in clusterdetailview',props.id)
    console.log(c);
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
    segments.value = c.segments;
  });
});
</script>

<style scoped>
.card-container {
    height: 80%;
    overflow-y: scroll;
}
.back-button:hover{
  background-color: rgb(85,85,85);
  color: white;

}

  @media screen and (max-width: 950px) {
    .back-button{
  margin-top:40px;
  margin-left:50px;
  font-size:28px;
   width:120px;
    }
  }


</style>