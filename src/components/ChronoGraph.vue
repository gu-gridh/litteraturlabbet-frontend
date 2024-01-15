<template>
  <div class="chronograph">
    <div v-if="!chronographReady">
      Laddar...
    </div>
    <!--Chronograph for author {{ props.author }}
        <button @click="debug()">Click to debug</button>-->
    <Suspense>
      <div class="chronoline">
        Sortering:
        <span class="chronoline-sorting" @click="sortBy('year')" :class="{'chronosorting-current': sortOrder == 'year'}">År</span>
        <span class="chronoline-sorting" @click="sortBy('author')" :class="{'chronosorting-current': sortOrder == 'author'}">Författare</span>
        <!-- By year -->
        <div v-show="sortOrder == 'year'">
          <div v-for="y in byYear">
            <div class="chronoheader">
              <h3>{{ y[0].imprint_year }}</h3>
            </div>
            <div class="chronoitems">
              <div v-for="d in y" class="chronoitem" :class="{ 'chronoitem-current': d.isCurrentAuthor }">
                <!--@click="navigate(d)">-->
                <!-- Tooltip and navigation to item excluded for now -->
                <!--  because one title might have multiple reuse clusters -->
                <!--  and the current functionality only links to one cluster -->
                <!--<span class="tooltiptext">Gå till återbruk som inkluderar {{ d.title }} av {{ d.main_author }}</span>-->
                <div class="chronoitem-inner">
                  <div class="chronoitem-author">
                    {{ d.main_author }}
                  </div>
                  <br />
                  <div class="chronoitem-title">
                    {{ d.title }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div v-show="sortOrder == 'author'">
          <div v-for="a in byAuthor">
            <div class="chronoheader">
              <h3>{{ a[0].mafl }}</h3>
            </div>
            <div class="chronoitems">
              <div v-for="d in a" class="chronoitem" :class="{ 'chronoitem-current': d.isCurrentAuthor }">
                <!--@click="navigate(d)">-->
                <!-- Tooltip and navigation to item excluded for now -->
                <!--  because one title might have multiple reuse clusters -->
                <!--  and the current functionality only links to one cluster -->
                <!--<span class="tooltiptext">Gå till återbruk som inkluderar {{ d.title }} av {{ d.main_author }}</span>-->
                <div class="chronoitem-inner">
                  <div class="chronoitem-author">
                    {{ d.main_author }}
                  </div>
                  <br />
                  <div class="chronoitem-title">
                    {{ d.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--
        <div v-show="sortOrder == 'title'">
          <div v-for="t in byTitle">
            <div class="chronoheader">
              <h3>{{ t[0].tfl }}</h3>
            </div>
            <div class="chronoitems">
              <div v-for="d in t" class="chronoitem" :class="{ 'chronoitem-current': d.isCurrentAuthor }">
                
                <span class="tooltiptext">Gå till återbruk som inkluderar {{ d.title }} av {{ d.main_author }}</span>
                <div class="chronoitem-inner">
                  <div class="chronoitem-author">
                    {{ d.main_author }}
                  </div>
                  <br />
                  <div class="chronoitem-title">
                    {{ d.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        -->
      </div>
    </Suspense>
  </div>
    

  
  <br />
</template>
 
<script setup lang="ts">
import type { Cluster } from '@/types/litteraturlabbet';
import { list } from "@/services/diana";
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { sort } from 'd3';

const router = useRouter();

const chronographReady = ref(false);

const sortOrder = ref("year");

const props = defineProps<{
  author?: number;
  work?: number;
}>();


const params = {
  has_author: props.author,
  work: props.work,
};
type ChronoBY = {
  [year: string]: ChronoData[];
}
type ChronoBA = {
  [author: string]: ChronoData[];
}
type ChronoBT = {
  [title: string]: ChronoData[];
}
type ChronoData = {
  main_author: string;
  imprint_year: number;
  title: string;
  cluster: number;
  text: string;
  isCurrentAuthor: boolean;
  mafl: string;
  tfl: string;
}
let byYear: ChronoBY = {};
let byAuthor: ChronoBA = {};

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
        isCurrentAuthor: main_author_id == props.author,
        mafl: main_author.toUpperCase()[0],
        tfl: title.toUpperCase()[0],
      }
      if (byYear[imprint_year]) {
        byYear[imprint_year].push(obj);
      } else {
        byYear[imprint_year] = [obj];
      }
      const mafl = main_author.toUpperCase()[0];
      if (byAuthor[mafl]) {
        byAuthor[mafl].push(obj);
      } else {
        byAuthor[mafl] = [obj];
      }
      out.push(obj);
      smap.push(skey);
    }
  }
  chronographReady.value = true;
  return out;
});
data.sort((a, b) => {
  if (a.imprint_year < b.imprint_year) {
    return -1;
  }
  if (a.imprint_year > b.imprint_year) {
    return 1;
  }
  return 0;
});
const abia = Object.keys(byAuthor).sort();
const abiy = Object.keys(byYear).sort();
byAuthor = abia.reduce((obj, key) => {
  const a = byAuthor[key];
  a.sort((a, b) => {
    if (a.main_author < b.main_author) {
      return -1;
    }
    if (a.main_author > b.main_author) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
  obj[key] = a;
  return obj;
}, {} as ChronoBA);
byYear = abiy.reduce((obj, key) => {
  const a = byYear[key];
  a.sort((a, b) => {
    if (a.main_author < b.main_author) {
      return -1;
    }
    if (a.main_author > b.main_author) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
  obj[key] = a;
  return obj;
}, {} as ChronoBY);

function navigate(d: ChronoData) {
  console.log("navigating");
  router.push({
    name: "cluster",
    params: {
      id: d.cluster,
    },
  });
}

function sortBy(key: string) {
  sortOrder.value = key;
}
</script>
 
<style scoped>
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
  background: var(--theme-accent-color);
  border-radius: 1px;
}

/* Tooltip text */
.tooltip .tooltiptext {
  opacity: 100%;
  width: 220px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;

}

@keyframes show-tooltip {
  0% {
    opacity: 0;
    transform: translateY(1px);
  }

  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  animation: show-tooltip 0.5s ease-in-out forwards;
  animation-delay: 0.5s;
}

.chronoline {
  width: 100%;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  margin: 20px 0;
}

.chronoheader {
  background-color: #f2f2f2;
  padding: 10px;
  margin-bottom: 10px;
}

.chronoitems {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.chronoitem {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  margin-right: 2px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.chronoitem.chronoitem-current {
  background-color: #eee;
}

.chronoitem-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chronoitem-author {
  font-weight: bold;
  margin-right: 10px;
}

.chronoitem-title {
  font-size: 1rem;
}
.chronosorting-current {
  font-weight: bold;
  text-decoration: underline;
  cursor: default;
}

.chronoline-sorting {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
 