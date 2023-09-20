<template>
    <div class="chronograph">
        <!--Chronograph for author {{ props.author }}
        <button @click="debug()">Click to debug</button>-->
        <Suspense>
            <div class="chronoline" id="draggable">
                <div v-for="y in byYear">
                    <div class="chronoheader">
                        {{ y[0].imprint_year }}
                    </div>
                    <hr/>
                    <div v-for="d in y" class="chronoitem" :class="{ 'chronoitem-current': d.isCurrentAuthor }">
                        <span @click="navigate(d)">{{ d.main_author }}: {{ d.title }}</span>
                    </div>
                </div>
            </div>
            <template #fallback>
                <div>Loading...</div>
            </template>
        </Suspense>
    </div>
    <div>
        
    </div>
 </template>
 
 <script setup lang="ts">
import type { Cluster } from '@/types/litteraturlabbet';
import { list } from "@/services/diana";
import { useRouter } from 'vue-router';

const router = useRouter();

 const props = defineProps<{
   author?: number;
   work?: number;
 }>();


 const params = {
    has_author: props.author,
    work: props.work,
  };
  type ChronoBY = {
    [year: number]: ChronoData[];
  }
type ChronoData = {
    main_author: string;
    imprint_year: number;
    title: string;
    cluster: number;
    text: string;
    isCurrentAuthor: boolean;
}
  let byYear: ChronoBY = {};

 const data: ChronoData[] = await list<Cluster>("cluster", params, 4).then((res) => {
    let out = [];
    let smap = [];
    for (let i = 0; i < res.results.length; i++) {
        const r = res.results[i];
        for (let j = 0; j < r.segments.length; j++) {
            const s = r.segments[j];
            const main_author = s.series.main_author.formatted_name;
            const main_author_id = s.series.main_author.id;
            const imprint_year = s.series.imprint_year;
            const title = s.series.short_title ? s.series.short_title : s.series.title;
            const series = s.series.id;
            if (props.work) {
                if (main_author_id === props.author) {
                    if (series !== props.work) {
                       continue;
                    }
                }
            }
            const text = s.text;
            const skey = `${main_author}-${imprint_year}-${title}`;
            if (smap.indexOf(skey) > -1)
                continue;
            const obj = {
                main_author: main_author,
                imprint_year: imprint_year,
                title: title,
                cluster: r.id,
                text: text,
                isCurrentAuthor: main_author_id == props.author
            }
            if (byYear[imprint_year]) {
                byYear[imprint_year].push(obj);
            } else {
                byYear[imprint_year] = [obj];
            }
            out.push(obj);
            smap.push(skey);
        }
    }
    return out;
  });
  data.sort((a,b) => {
    if (a.imprint_year < b.imprint_year) {
        return -1;
    }
    if (a.imprint_year > b.imprint_year) {
        return 1;
    }
    return 0;
  });

 function debug() {
    console.log(byYear);
  }

  function show(d: ChronoData) {
    console.log(d);
  }

  function navigate(d: ChronoData) {
    console.log("navigating");
     router.push({
          name: "cluster",
          params: {
            id: d.cluster,
          },
        });
  }

 </script>
 
 <style scoped>
 
 .chronograph {
   padding-left: 50px;
   padding-right: 50px;
   position: relative;
   height: 300px;
   align-items: center;
   justify-content: center;
   overflow-y: scroll;
 }

 .chronoline {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: flex-start;
    justify-content: center;
    align-items: flex-start;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    
    
 }

 .chronoitem {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 1.2rem;
 }

 .chronoheader {
    font-weight: bold;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 1.2rem;
 }

 .chronoitem-current {
    font-weight: bold;
    color: red;
 }

 /* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 1px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: red;
  border-radius: 1px;
}
 </style>
 