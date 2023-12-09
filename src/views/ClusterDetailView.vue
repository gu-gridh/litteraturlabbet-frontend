<template>
  <div class="card-container">
    <div class="top-row">
      <div class="back-button" @click="customBack()">Tillbaka</div>
      <div class="change-order">
        <label for="order">Sortera efter:</label>
        <select class="dropdown" v-model="order" @change="update()">
          <option value="year">År</option>
          <option value="author">Författare</option>
        </select>
      </div>
    </div>
      <div class="littlabbinfo" v-if="segments?.length > 1">Klicka på ett stycke för att se hela texten hos Litteraturbanken</div>
    
      <div v-if="segments?.length === 0">
        <div class="text-container">
          <p>
            Det finns inga textstycken som matchar dina sökkriterier.
          </p>
        </div>
      </div>
      <div v-else>
          <segment-card v-for="segment in segments" v-bind:key="segment.id" :segment="segment"></segment-card>
      </div>
    
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { list, get } from "@/services/diana";
import SegmentCard from "@/components/SegmentCard.vue";
import type {
  Author,
  Page,
  Work,
  Segment,
  Cluster,
} from "@/types/litteraturlabbet";
import { setBusy, setNotBusy } from "@/components/Waiter.vue";
import { searchStore } from "@/stores/search";

const props = defineProps<{
  id: string;
}>();
const store = searchStore();
const cluster = ref<Cluster>();
let segments = ref<Array<Segment>>();
let order = ref<string>("year");

onBeforeMount(() => {
  const numId = parseInt(props.id);
  get<Cluster>(numId, "cluster", 4).then((c) => {
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
    if (store.yearStart) {
      c.segments = c.segments.filter((s) => s.series.imprint_year >= store.yearStart);
    }
    if (store.yearEnd) {
      c.segments = c.segments.filter((s) => s.series.imprint_year <= store.yearEnd);
    }
    if (c.segments.length === 0) {
      segments.value = [];
      setNotBusy();
      return;
    }
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

function update() {

  console.log("Update" + order.value);
  if (order.value === "year") {
    segments.value?.sort((a, b) => {
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
  } else if (order.value === "author") {
    segments.value?.sort((a, b) => {
      if (a.series.main_author.formatted_name < b.series.main_author.formatted_name) {
        return -1;
      }
      if (a.series.main_author.formatted_name > b.series.main_author.formatted_name) {
        return 1;
      }
      if (a.series.imprint_year < b.series.imprint_year) {
        return -1;
      }
      if (a.series.imprint_year > b.series.imprint_year) {
        return 1;
      }
      return 0;
    });
  } else {
    console.log("Error. Unknown order value: " + order.value);
  }
}

function updateTime() {
  const numId = parseInt(props.id);
  get<Cluster>(numId, "cluster", 4).then((c) => {
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
    if (store.yearStart) {
      c.segments = c.segments.filter((s) => s.series.imprint_year >= store.yearStart);
    }
    if (store.yearEnd) {
      c.segments = c.segments.filter((s) => s.series.imprint_year <= store.yearEnd);
    }
    if (c.segments.length === 0) {
      segments.value = [];
      setNotBusy();
      return;
    }
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
    update();
  });
}

watch(
  // watch for changes in store.yearStart and End, and update the segments accordingly
  () => [store.yearStart, store.yearEnd],
  () => updateTime(),
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped>

.text-container{
  margin-top:15%;
  width:100%;
  text-align:center;
  font-size:1.8em;
}

.top-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.change-order {
  margin-left: 20px;
  float: right;
  color:black;
  padding-right:40px;

}

.dropdown {
  font-size:1em;
    color: white;
    border-radius: 5px;
    padding: 4px 10px;
    padding-right: 30px;
    margin-left:5px;
    width: auto;
    height: auto;
    background-image: url("@/assets/dropdown-arrow.png");
    background-size: 10px;
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) 55%;
    background-color:var(--theme-accent-color);
    -webkit-appearance: none;
    /* text-transform: capitalize; */
}
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