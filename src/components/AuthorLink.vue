<script setup lang="ts">

import { get, getAligned } from "@/services/littlabb";
import { useRoute } from "vue-router";
import type { Author } from "@/types/litteraturlabbet";
import SegmentPairCard from './SegmentPairCard.vue';
import { searchStore } from "@/stores/search";
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { setBusy, setNotBusy } from "./Waiter.vue";

const route = useRoute();

const a1 = route.params.id1;
const a2 = route.params.id2;

const data = await getAligned<any>({"author_1": a1, "author_2": a2});

const author1 = await get<Author>(<unknown>a1 as number, "author");
const author2 = await get<Author>(<unknown>a2 as number, "author");

const store = searchStore();

const segments2 = ref<Array<any>>([]);

const numExcluded = ref<number>(0);

onBeforeMount(() => filterData());

function filterData() {
    let segments: any[] = [];
    for (let i = 0; i < data.results.length; i++) {
        let s1 = null;
        let s2 = null;
        let y1 = null;
        let y2 = null;
        let id1 = null;
        let id2 = null;
        for (let j = 0; j < data.results[i].segments.length; j++) {
            const s = data.results[i].segments[j];
            const main_author = s.series.main_author.id;
            const year = s.series.imprint_year;
            const id = s.series.id;
            if (main_author == a1) {
                if (s1) {
                    s2 = s;
                    y2 = year;
                    id2 = id;
                } else {
                    s1 = s;
                    y1 = year;
                    id1 = id;
                }
            } else if (main_author == a2) {
                if (s2) {
                    s1 = s;
                    y1 = year;
                    id1 = id;
                } else {
                    s2 = s;
                    y2 = year;
                    id2 = id;
                }
            }
        }
        
        if (a1 === a2) {
            if (id1 === id2) {
                continue;
            }
        }
            
        // Throw away invalid pairs where one or two of the segments are null
        if (!y1 || !y2) {
            continue;
        }
        
        if (y1 < y2)
            segments.push([s1, s2]);
        else
            segments.push([s2, s1]);
    }
    segments.sort((a,b) => {
        if (a[0].series.imprint_year < b[0].series.imprint_year) {
            return -1;
        }
        if (a[0].series.imprint_year > b[0].series.imprint_year) {
            return 1;
        }
        return 0;
    });
    if (store.yearStart) {
        segments = segments.filter((s) => s[0].series.imprint_year >= store.yearStart! && s[1].series.imprint_year >= store.yearStart!);
    }
    if (store.yearEnd) {
        segments = segments.filter((s) => s[0].series.imprint_year <= store.yearEnd! && s[1].series.imprint_year <= store.yearEnd!);
    }
    numExcluded.value = data.results.length - segments.length;
    segments2.value = segments;
}

function customBack() {
    setBusy();
    store.author = undefined;
    store.author2 = undefined;
    store.work = undefined;
    history.back();
}

onMounted(() => {
    setNotBusy();
});

onBeforeUnmount(() => {
    setBusy();
});

watch(
    () => store.yearStart,
    () => filterData(),
    {
        immediate: true,
        deep: true,
    }
);

watch(
    () => store.yearEnd,
    () => filterData(),
    {
        immediate: true,
        deep: true,
    }
);

</script>

<template>
         <div style="width:100%; "> <div class="back-button" @click="customBack()">Tillbaka</div> </div>

        <h2>Mellan <span class="author-name">{{ author1.name }}</span> och <span class="author-name">{{ author2.name }}</span> hittar vi <span class="author-name">{{ segments2.length}} stycken</span> textåterbruk</h2>

        

        <div class="littlabbinfo" v-if="segments2.length > 1">Klicka på ett stycke för att se hela texten hos Litteraturbanken</div>

        <div v-if="numExcluded > 0">
            <div class="exclude-label label-color">
          <span class="exclusion-number">{{ numExcluded }} stycke<span v-if="numExcluded > 1">n</span></span> 
          exkludera<span v-if="numExcluded === 1">t</span><span v-if="numExcluded > 1">de</span> på grund av att de<span v-if="numExcluded === 1">t</span> faller utanför vald tidsperiod <i>eller</i> att de inte är mellan valda författare.
        </div>
      </div>
              <div class="link-container">
            
        <div v-if="segments2.length===0">
            <br/>
            <div class="text-container">
                <h3>Inga textåterbruk funna</h3>
            </div>
        </div>
        <div v-else>
            <segment-pair-card v-for="segmentpair in segments2" v-bind:key="segmentpair[0].id" :segment1="segmentpair[0]" :segment2="segmentpair[1]"></segment-pair-card>
        </div>
    </div>
    
</template>

<style scoped>


.link-container {
    margin: 20px;
    margin-left:3.5em;
    font-size: 12px;
}


h2{
   color:black;
   padding-left:45px;
   font-size:1.2em;
}

h3{
   color:black;
   text-align:center;
   padding-top:8%;
   font-weight:100;
   font-size:3.2em;
}
</style>