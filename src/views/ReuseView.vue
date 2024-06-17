<template>
    <div class="module-title">
  <div style="position:absolute; top:30px; left:28px; font-size:2.0em!important; font-weight:100!important; z-index:1000;">Textåterbruk</div>
</div>

  <div style="min-height:580px">

  <div v-if="author" class="reuse-container-w-author">
    <div v-if="showGraph">
      <div class="chart-container">
        <network-chart
          :data="data"
          :author="author"
          :width="3000"
          :height="490"
        >
      </network-chart>
      </div>
    </div>
  
    <div class="Fade"></div>
  
    <suspense>
      <reuse-list v-if="author" :author="author" :work="work"></reuse-list>
    </suspense>
  </div>

  <div v-else class="reuse-container-wo-author">
    <div class="module-content" style="margin-top:40px;">
      Med detta verktyg kan användare undersöka nätverket av textåterbruk i delar
      av Litteraturbankens material. Textåterbruk, på engelska <i>textual reuse</i>, är ett fenomen där
      textstycken återkommer i flera olika skrivna verk. Detta kan bero på
      plagiat, citat, utbyten mellan författare, eller mer vardagliga orsaker.
      Eventuellt återbruk är inte alltid avsiktligt, utan kan bero på
      parafraser, vanliga talesätt eller helt enkelt redaktörers ingrepp i
      författares verk. Återbruk är inte nödvändigtivs linjärt;
      det kan exempelvis finnas en odokumenterad tredje part varifrån texten
      ursprungligen kommer. Av denna anledning kan man inte med enkla medel
      bestämma vem som eventuellt plagierat vem.    
    </div>
    <TopLists/>
  </div>
</div>
</template>

<script setup lang="ts">
import NetworkChart from "@/components/NetworkChart.vue";
import ReuseList from "@/components/ReuseList.vue";
import type { Work, Author } from "@/types/litteraturlabbet";
import { get } from "@/services/diana";
import { searchStore } from "@/stores/search";
import { networkStore } from "@/stores/network";
import type { Link, Node } from "@/types/network";
import { unpaginated, list } from "@/services/diana";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import TopLists from "./TopLists.vue";
import { setBusy, setNotBusy } from "@/components/Waiter.vue";
import { authors } from "@/assets/authors_years.json";
import { onBeforeMount } from "vue";

const store = searchStore();
const dataStore = networkStore();
let showGraph: boolean = true;

const props = defineProps<{
  author?: number;
  work?: number;
}>();

const data = (props.author||props.work) ? await fetch() : { nodes: [], links: [] };
/*
let data: any;
if (dataStore.data.nodes && dataStore.data.nodes.length>0) {
  data = { nodes: [], links: [] };
  data.nodes = dataStore.data.nodes;
  data.links = dataStore.data.links;
} else {
  data = (props.author||props.work) ? await fetch() : { nodes: [], links: [] };
  dataStore.data.nodes = data.nodes;
  dataStore.data.links = data.links;
}*/

if (props.author) {
  get<Author>(props.author, "author").then((a) => {
    store.author = a;
  });
} 

if (props.work) {
  get<Work>(props.work, "work/19th_century").then((w) => {
    store.work = w;
  });
}

watch(() => store.author, () => {
  
})

// onMounted(async () => {
//   data.value = await fetch();

// })
onMounted(() => {
  setNotBusy();
  scrollTo({
    top: 220,
    behavior: "smooth",
  })
})

onBeforeUnmount(() => {
  setBusy();
});
function fShowGraph() {
  showGraph = true;
}

function fShowChronograph() {
  showGraph = false;
}

//onBeforeMount(() => {
  //if (dataStore.data.nodes && dataStore.data.nodes.length > 0) {
   // console.log(dataStore.data);
    //data.value = dataStore.data;
    //console.log("Reusing data!");
  //} else {
   // console.log("Loading data");
    //data.value = { nodes: [], links: [] };
    //loadData();
  //}
//})

async function fetch() {
  
  let links = await unpaginated<Link>("author_exchange", {});
  let ids = links
    .map((l) => l.source)
    .concat(links.map((l) => l.target))
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
/*
  let nodes = await list<Author>("author", { limit: 3500 }).then((a) => {
    const authors = a.results.filter((a) => ids.includes(a.id));

    return authors.map((a) => {
      return {
        id: a.id,
        name: a.name,
        neighbors: new Array<Node>(),
        links: new Array<Link>(),
      } as Node;
    });
  });
  return { nodes: nodes, links: links };
  
}
*/
// Rewrite the nodes to use a local copy of the data instead of loading it from the backend
let nodes = authors.map((a) => { 
  return {
    id: parseInt(a.id),
    name: a.formatted_name,
    neighbors: new Array<Node>(),
    links: new Array<Link>(),
  } as Node;
});
return { nodes: nodes, links: links };
}
</script>

<style scoped>

.Fade{
  background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(255,255,255,0) 100%);
  width:100%;
  height:152px;
  pointer-events: none;
  margin-top:-172px;
}


.about-reuse {
  /* width: 200px; */
  color: black;
  font-size: x-large;
}

p{
line-height:1.2;
font-size:16px;
}

.chart-container {
  width: 100%;
  height: 470px;
  margin-top: 0px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reuse-container-wo-author {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height:600px;
}

.reuse-container-w-author {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom:20px;
  min-height:380px!important;
}

.author-name,
.work-title {
  background-color: black;
  color: white;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  border-radius: 8px;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

  @media screen and (max-width: 1550px) {
.about-reuse {
display:none;
  
}

p {
display:none;
}
}

</style>
