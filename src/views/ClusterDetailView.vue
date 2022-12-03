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

.back-button{
  padding:5px;
  font-size:16px;
  text-align:center;
  color:white;
  border-radius:8px;
  cursor:pointer;
  height:auto;
  width:80px;
  margin:20px;
  margin-left:3em;
  background-color:rgb(182, 82, 139)
}

.back-button:hover{
    background-color:rgb(202, 102, 159);
    color:black;

}


</style>