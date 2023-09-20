<script setup lang="ts">
import { reuseStore } from '@/stores/reuse';
import { get, getAligned } from "@/services/diana";
import type { AlignedSegment } from "@/types/litteraturlabbet";
import { useRoute } from "vue-router";
import type { Author, Segment, Work, Page } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";
import SegmentCard from "@/components/SegmentCard.vue";
import SegmentPairCard from './SegmentPairCard.vue';

const route = useRoute();

const a1 = route.params.id1;
const a2 = route.params.id2;

const data = await getAligned<any>({"author_1": a1, "author_2": a2});

const author1 = await get<Author>(<unknown>a1 as number, "author");
const author2 = await get<Author>(<unknown>a2 as number, "author");


let segments: any[] = [];
for (let i = 0; i < data.results.length; i++) {
    let s1 = null;
    let s2 = null;
    let y1 = null;
    let y2 = null;
    for (let j = 0; j < data.results[i].segments.length; j++) {
        const s = data.results[i].segments[j];
        const main_author = s.series.main_author.id;
        const year = s.series.imprint_year;
        if (main_author == a1) {
            s1 = s;
            y1 = year;
        }
        if (main_author == a2) {
            s2 = s;
            y2 = year;
        }
    }
    if (y1 < y2)
        segments.push([s1, s2]);
    else
        segments.push([s2, s1]);
    //segments.push([s1, s2]);
}
segments.sort((a,b) => {
    console.log(a);
    if (a[0].series.imprint_year < b[0].series.imprint_year) {
        return -1;
    }
    if (a[0].series.imprint_year > b[0].series.imprint_year) {
        return 1;
    }
    return 0;
});
</script>

<template>
   <div class="back-button" onclick="history.back()">Tillbaka</div>
    <div class="link-container">
        <h2>Textåterbruk mellan <span class="author-name">{{ author1.name }}</span> och <span class="author-name">{{ author2.name }}</span></h2>
        <Suspense>
            <segment-pair-card v-for="segmentpair in segments" v-bind:key="segmentpair[0].id" :segment1="segmentpair[0]" :segment2="segmentpair[1]"></segment-pair-card>
        </Suspense>
        <div v-if="segments.length===0">
            <p>
            Inga textåterbruk hittades.
        </p>
        </div>
    </div>
    
</template>

<style scoped>
.link-container {
    margin: 20px;
    margin-left:3.5em;
    font-size: 12px;
}
</style>