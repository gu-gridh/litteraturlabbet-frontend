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
    <!-- Exclusion container -->
   
      <!-- End exclusion container -->
      <div class="littlabbinfo label-color" style="font-size:1.2em; line-height:1.0; padding-bottom:10px;">Klicka på ett stycke för att se hela texten hos Litteraturbanken.</div>
      
      <div class="littlabbinfo label-color" style="font-size:1.2em; line-height:1.0; padding-top:20px;" v-if="store.selfReuse&&store.author?.name">
        Externa överensstämmelser presenteras först, medan de interna placeras underst.
      </div>
      <div v-if="numExcluded > 0">
        <div class="exclude-label label-color">
          <span class="exclusion-number">{{ numExcluded }} stycke<span v-if="numExcluded > 1">n</span></span> 
          exkludera<span v-if="numExcluded === 1">t</span><span v-if="numExcluded > 1">de</span> på grund av att de<span v-if="numExcluded === 1">t</span> faller utanför vald tidsperiod.
        </div>
      </div>

      <div v-if="segments?.length === 0 || (!store.selfReuse && segmentsOther?.length === 0)">
        <div class="text-container">
          <p>
            Det finns inga textstycken som matchar dina sökkriterier.
          </p>
        </div>
      </div>
      <div v-else>
        <div class="littlabbinfo label-color" style="font-size:1.2em; line-height:1.0; padding-top:20px;">
          I verk av <span v-if="store.author"><span>andra</span></span><span v-else>alla</span> författare finner vi <span>{{ segmentsOther?.length }}</span> återbruk av stycket.
        </div>
          <segment-card v-for="segment in segmentsOther" v-bind:key="segment.id" :segment="segment" :other-target="otherTarget"></segment-card>
          <br>
          
          <div v-if="store.author&&store.selfReuse">
            <hr/>
          <br>
          <div class="littlabbinfo label-color" style="font-size:1.2em; line-height:1.0; padding-top:20px;">

          I verk av <span>{{ store.author?.name }}</span> finner vi <span>{{ segmentsSelf?.length }}</span> återbruk av stycket.
        </div>  
          <segment-card v-for="segment in segmentsSelf" v-bind:key="segment.id" :segment="segment" :other-target="otherTarget"></segment-card>
        </div>
      
      </div>
    
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { get } from "@/services/littlabb";
import SegmentCard from "@/components/SegmentCard.vue";
import type {
  Segment,
  Cluster,
Author,
} from "@/types/litteraturlabbet";
import { setBusy, setNotBusy } from "@/components/Waiter.vue";
import { searchStore } from "@/stores/search";
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps<{
  id: string;
}>();
const store = searchStore();
const cluster = ref<Cluster>();
let segments = ref<Array<Segment>>();
let order = ref<string>("year");
const numExcluded = ref<number>(0);
const otherTarget = ref<string>("");
const segmentsSelf = ref<Array<Segment>>();
const segmentsOther = ref<Array<Segment>>();

function filterData() {
  const numId = parseInt(props.id);
  let includedSegments: Segment[] = [];
  let excludedSegments = [];
  console.log(numId);
  get<Cluster>(numId, "cluster", 4).then((c) => {
    let seenSegmentIds = new Set();
    for (let i = 0; i < c.segments.length; i++) {
      const segment_i = c.segments[i];
      const gid = segment_i.gid;
      const author = segment_i.series.main_author.id;
      if (!store.selfReuse) {
        if (author === store.author?.id) {
          continue;
        }
      }
      if (seenSegmentIds.has(gid)) {
        c.segments.splice(i, 1);
        i--;
      } else {
        seenSegmentIds.add(gid);
      }
      if (store.yearStart) {
          if (segment_i.series.imprint_year >= store.yearStart) {
            includedSegments.push(segment_i);
          } else {
            excludedSegments.push(segment_i);
          }
        } else {
          includedSegments.push(segment_i);
        }
        if (store.yearEnd) {
          if (segment_i.series.imprint_year <= store.yearEnd) {
            includedSegments.push(segment_i);
          } else {
            excludedSegments.push(segment_i);
          }
        } else {
          includedSegments.push(segment_i);
        }
    }
    console.log(excludedSegments);
    c.size = 0;//c.size - seenSegmentIds.size + 1;
    cluster.value = c;
    if (store.yearStart) {
      c.segments = c.segments.filter((s) => s.series.imprint_year >= store.yearStart!);
    }
    if (store.yearEnd) {
      c.segments = c.segments.filter((s) => s.series.imprint_year <= store.yearEnd!);
    }
    //console.log("Included segments: ", includedSegments);
    //c.segments = includedSegments;
    if (excludedSegments.length > 0) {
      //console.log("Excluded segments: ", excludedSegments.length);
      numExcluded.value = excludedSegments.length;
      console.log(numExcluded.value);
      console.log(excludedSegments);
    } else {
      numExcluded.value = 0;
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
    // sort results such that the segments are ordered by not-current-author first, then current author last
    let segmentsOthers: Segment[] | undefined = [];
    let segmentsCurrent: Segment[] | undefined = [];
    segments.value?.forEach((segment) => {
      if (segment.series.main_author.id === store.author?.id) {
        segmentsCurrent.push(segment);
      } else {
        segmentsOthers.push(segment);
      }
      
    });
    segmentsSelf.value = segmentsCurrent;
    segmentsOther.value = segmentsOthers;
    });
    setNotBusy();
}

onBeforeMount(() => {
  // if route contains phrase parameter, highlight the phrase in the text
  if (route.params.phrase) {
    //console.log("Phrase: " + route.params.phrase);
    otherTarget.value = route.params.phrase+"";
  }
  else if (route.params.author) {
    get(parseInt(route.params.author+""), "author", 2).then((a) => {
      store.author = a as Author;
    });
  }
  filterData();
  
});

function customBack() {
  setBusy();
  history.back();
}

onBeforeUnmount(() => {
  setBusy();
});

function update() {

  //console.log("Update" + order.value);
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
  // sort results such that the segments are ordered by not-current-author first, then current author last
  let segmentsOthers: Segment[] | undefined = [];
    let segmentsCurrent: Segment[] | undefined = [];
    segments.value?.forEach((segment) => {
      if (segment.series.main_author.id === store.author?.id) {
        segmentsCurrent.push(segment);
      } else {
        segmentsOthers.push(segment);
      }
      
    });
    segmentsSelf.value = segmentsCurrent;
    segmentsOther.value = segmentsOthers;
}

function updateTime() {
  filterData();
  update();
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
  .littlabbinfo span{
    color:var(--theme-accent-color);
    font-weight: 600;
  }
.text-container{
  margin-top:15%;
  width:100%;
  text-align:center;
  font-size:1.8em;
  color:black;
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
    appearance: none;
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