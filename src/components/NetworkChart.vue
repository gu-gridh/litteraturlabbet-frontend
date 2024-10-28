<template>
     <div class="controls">
        <div class="slider-container">

          <Slider v-model="secondaryNodeNumber" :min="0" :max="1000" :step="50" class="slider-color" tooltipPosition="top"
            @update="recalculateGraph" lazy></Slider>
          <div style="margin-top:8px; color:grey;">Max antal indirekta relationsnoder</div>
        </div>
      </div>

  <div class="legend" v-if="props.author">
    <div class="author-label text-shadow">
      <div class="author-circle"></div> {{ authorStore.author?.formatted_name }}
    </div>
    <div class="reuse-label text-shadow">
      <div class="reuse-circle"></div>Direkta återbruk
    </div>
    <div class="secondary-label text-shadow">
      <div class="secondary-circle"></div>Indirekta relationer
    </div>
  </div>

  <div class="dropdown-super" v-if="props.author">
    <div class="dropdown">
      <button class="dropbtn">Instruktioner</button>
      <div class="dropdown-content">
        <div>Skrolla för att zooma.</div>
        <div>Klicka på en författare eller kopplingen <br>
            mellan två författare för att göra en sökning.</div>
        <div>Klicka och dra vid sidan av nätverket för att justera vyn, och klicka och dra individuella författare <br>för att organisera om nätverket.</div>
        
        <div>Nätverket visar alla <span>direkta återbruk</span>, det vill säga alla författare som har återbruk med valda
          författaren, samt ett valbart antal <span>Indirekta relationer</span>. Dessa  är författare som inte har direkta återbruk med den valda författaren men istället med andra författare i nätverket.</div>
      </div>
    </div>
  </div>

  <div v-show="showNetwork">
  <div class="chart-super-container">
    <div class="chart-container">  
      <div id="chart" ref="element"></div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import ForceGraph, { type NodeObject } from "force-graph";
import type { Author } from "@/types/litteraturlabbet";
import { ref, watch, onMounted } from "vue";
import type { Link, Node } from "@/types/network";
import { get } from "@/services/diana";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { searchStore } from "@/stores/search";
import { reuseStore } from "@/stores/reuse";
import Slider from '@vueform/slider'
import { setBusy } from "./Waiter.vue";

const authorStore = searchStore();
const linkStore = reuseStore();
let secondaryNodeNumber = ref(50);
const showNetwork = ref(true);

const props = defineProps<{
  data: { nodes: Array<Node> | []; links: Array<Link> | [] };
  author?: number;
  height: number;
  width: number;
}>();

const element = ref();
const route = useRoute();
const router = useRouter();
const loading = ref(true);
// const graph = build(props.data, props.author);
const graph = ref();
let graphVisible = ref(false);
const store = searchStore();

onMounted(() => {
  if (props.data) {
    graph.value = build(props.data, props.author);
  }
});
watch(
  () => props,
  () => {
    graph.value = build(props.data, props.author);
  },
  { deep: true }
);

watch(
  () => store.yearStart,
  () => build(props.data, props.author),
  { deep: true }
)

watch(
  () => store.yearEnd,
  () => build(props.data, props.author),
  { deep: true }
)

function recalculateGraph() {
  graph.value = build(props.data, props.author);
}

function build(graphData: any, author?: number) {
  graphVisible = ref(false);

  const graph = ForceGraph();
  const highlightNodes = new Set();
  const highlightLinks = new Set();
  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return graph;
  }
  const data = structuredClone(graphData);
  //console.log(graphData);
  // Check if node is in the network
  // If not, return empty graph
  console.log(author);
  console.log(data.nodes);
  if (author && data.nodes.filter((n: any) => n.id === author).length === 0) {
    console.log("Author not in network");
    return graph;
  }
  if (!author) {
    return graph;
  }
  /*
  if (author === 3292) {
    graphVisible = ref(false);
    return;
  }
  */
  graphVisible = ref(true);
  let seenNeighbors: any[] = [];
  /*
  
  // Convert node ids to node objects for force-graph
  const authorNode = data.nodes.filter((n: any) => n.id === author)[0];
  const primaryConnections = [];
  const sourceLinks = data.links.filter((l: Link) => l.source === author);
  const targetLinks = data.links.filter((l: Link) => l.target === author);
  */

  let neighborCount = 0;
  data.links = data.links.map(function (link: Link) {
    const sourceNode = data.nodes.find(function (n: Node) { return n.id === link.source; });
    const targetNode = data.nodes.find(function (n: Node) { return n.id === link.target; });
    if (sourceNode && targetNode) {
      const isCurrentAuthor = sourceNode.id === author || targetNode.id === author;
      const isNeighbor = seenNeighbors.indexOf(sourceNode.id) > -1;
      if (isCurrentAuthor || isNeighbor) {
        if (isNeighbor) {
          if (neighborCount >= secondaryNodeNumber.value) {
            return;
          }
          neighborCount++;
          link.dashed = true;
        }
        // Ensure source and target have the neighbors and links properties
        sourceNode.neighbors = sourceNode.neighbors || [];
        targetNode.neighbors = targetNode.neighbors || [];
        sourceNode.links = sourceNode.links || [];
        targetNode.links = targetNode.links || [];
        // Update the connections
        sourceNode.neighbors.push(targetNode);
        targetNode.neighbors.push(sourceNode);
        link.name = `Återbruk mellan ${sourceNode.name} och ${targetNode.name}`;
        sourceNode.links.push(link);
        targetNode.links.push(link);

        if (sourceNode.id === author) {
          seenNeighbors.push(targetNode.id);
        } else if (targetNode.id === author) {
          seenNeighbors.push(sourceNode.id);
        }

        return {
          ...link,
          source: sourceNode,
          target: targetNode,
        };
      }

    }

    return null;
  }).filter((link: Link) => link); // removes null values
  data.nodes = data.nodes.filter((node: Node) => node.neighbors.length > 0);
  let hoverNode: Node;

  if (author) {
    hoverNode = data.nodes.filter((n: Node) => n.id === author)[0];
    if (hoverNode) {
    highlightNodes.add(hoverNode);
    hoverNode.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
    hoverNode.links.forEach((link: Link) => highlightLinks.add(link));
    }
  }
  return graph(element.value)
    .graphData(data)
    .width(props.width)
    .height(props.height)
    .linkWidth((link) => {
      let weight = data.links.filter(
        (l: Link) => l.source === link.source && l.target === link.target
      )[0].weight;
      // Filter them by their weight
      weight = weight ? 1.2 * Math.log(weight) : 1;
      return weight;
    })
    .onNodeClick(async (node) => {
      // Center/zoom on node
      //graph.centerAt(node.x, node.y, 1000);
      //graph.zoom(3, 2000);
      if (authorStore.author?.id !== node.id) {
        setBusy();
        showNetwork.value = false;
        authorStore.author = await get<Author>(node.id as number, "author");
        await router.push({
          name: "reuse2",
          params: {
            author: node.id,
            work: undefined,
          },
        });

      }
    })
    .onNodeRightClick(async (node) => {
      if (authorStore.author?.id !== node.id) {
        authorStore.author = await get<Author>(node.id as number, "author");
        setBusy();
        await router.push({
          name: "reuse2",
          params: {
            author: node.id,
            work: undefined,
          },
        })
      }
    })
    .onNodeHover((node) => {
      if (!author) {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
          highlightNodes.add(node);
          (<Node>node).neighbors.forEach((neighbor) =>
            highlightNodes.add(neighbor)
          );
          (<Node>node).links.forEach((link) => highlightLinks.add(link));
        }
        hoverNode = author
          ? data.nodes.filter((n: Node) => n.id === author)[0]
          : node || null;
      }
    })
    .onLinkHover((link: any) => {
      highlightLinks.clear();
      //highlightNodes.clear();
      if (link) {
        highlightLinks.add(link);

      }
    })

    //dotted links
    //.linkDirectionalParticles(4)
    //.linkDirectionalParticleWidth((link) => (highlightLinks.has(link) ? 4 : 0))
    //link color change on hover
    .linkColor((link) => {
      if (highlightLinks.has(link)) {
        return "#66CCFF";
      } else {
        return "rgb(211, 211, 211, 0.6)";
      }
    })
    .autoPauseRedraw(false) // keep redrawing after engine has stopped
    .onLinkClick((link) => {
      //TODO on click go to reuse page
      //console.log('go to reuse page', link);
      if (link) {
        if (link.source && link.target) {
          const linkSource = <NodeObject>link.source;
          const linkTarget = <NodeObject>link.target;
            const linkSourceId = linkSource.id as number;
            const linkTargetId = linkTarget.id as number;
          linkStore.updateAuthor1(linkSourceId);
          get<Author>(linkSourceId, "author").then((a) => { store.author = a; authorStore.author = a; });
          get<Author>(linkTargetId, "author").then((a) => { store.author2 = a; authorStore.author2 = a; });
          store.work = undefined;
          linkStore.updateAuthor2(linkSourceId);
          setBusy();
          router.push({
            name: "reuse-link",
            params: {
              id1: linkSourceId,
              id2: linkTargetId,
            },
          });
        }
      }
    })
    .nodeCanvasObjectMode((node) =>
      highlightNodes.has(node) ? "before" : undefined
    )
    .nodeColor((node) => {
      const mainAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent-color-light');
      const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-main-color-light');
      if (node === hoverNode) {
        return mainAccentColor;
      } else if (highlightNodes.has(node)) {
        return mainColor;
      } else {
        return "rgb(85, 85, 85)";
      }
    })
    .cooldownTime(1500)
    //.d3AlphaDecay(0.01)
    //.d3VelocityDecay(0.08)
    .onEngineStop(() => {
      if (author && hoverNode && !loading.value) {
        setTimeout(() => {
          hoverNode = data.nodes.filter((n: NodeObject) => n.id === author)[0];
          graph.centerAt(hoverNode.x, hoverNode.y, 1000);
          graph.zoom(2, 2000);
        }, 3);
      }
    })
    .onNodeDragEnd((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });
}
watch(
  () => [route, props.author],
  () => {
    loading.value = true;
    //graph.value = build(props.data, props.author);
    loading.value = false;
  },
  {
    // immediate: true,
    // deep: true,
  }
);

</script>
<style>
.chart-super-container {
  width: 100%;
  margin-right: 0rem;
  margin-top: -20px;
  padding: 0px;


}

.chart-container {
  padding: 0px;
  left: 0%;
  width: 100%;
  /* padding-bottom: 20px; */
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  /*  margin-left: 2rem;
  right: 100px;
  margin-right: 2rem; */
}

.dropdown-super {
  position: absolute;
  z-index: 10;
  width: 130px;
  top: 10px;
  right: 10px;
  margin-right: 0em;
  float: right;
  height: auto;
  padding: 10px 10px 10px 0px;
  border-radius: 12px;
}

.controls {
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 9;
  width: 100% !important;
  top: 420px;
  margin-top:0px;
  color: black;
  width: 100%;
}

.dropdown-super:hover {
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255, 0.85);
  width: 340px;
}

.dropbtn {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.4rem 1rem 0.4rem 1rem;
  font-size: 20px;
  color: white;
  background-color: rgb(150, 150, 150);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;
  cursor: pointer;
  display: block;
  float: right;
  right: 0px;
  margin-bottom: 5px;
}

/* The container <div> - needed to position the dropdown content */

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  padding: 10px;
  float: right;
  display: none;
  border-radius: 10px;
  font-size: 16px;
  min-width: 180px;
  text-align: right;
  z-index: 100;
}

/* Links inside the dropdown */
.dropdown-content * {
  font-family: "Barlow Condensed", sans-serif !important;
  color: black;
  /* padding: 12px 16px; */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-decoration: none;
  display: block;
  line-height: 1;
  z-index: 100;
}

.dropdown-content span{
display:inline;
font-weight:600;
}

.dropdown-super:hover .dropdown-content {
  display: block;
}

.dropdown-super:hover .dropbtn {
  background-color: rgb(80, 80, 80) !important;
  backdrop-filter: blur(10px);
}

.force-graph-container .graph-tooltip {
  position: absolute;
  white-space: nowrap;
  top: 0;
  font-family: sans-serif;
  font-size: 16px;
  padding: 2px 8px 0px 8px;
  border-radius: 5px;
  color: black !important;
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  visibility: hidden;
  /* by default */
}

.legend {
  position: absolute;
  z-index: 11;
  width: auto;
  top: 85px;
  left: 33px;
  font-size: 1.1em;
  font-weight: 500;
  pointer-events: none;
background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 0px 30px 30px rgba(255, 255, 255, 0.7); 
}

.author-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--theme-accent-color-light);
  margin-right: 10px;
  margin-top: 9px;
  float: left;
}

.reuse-circle {
  width: 10px;
  height: 10px;
  background-color: var(--theme-main-color-light);
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 9px;
  float: left;
}

.secondary-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(60, 60, 60);
  margin-right: 10px;
  margin-top: 9px;
  float: left;
}

.author-label {
  color: var(--theme-accent-color-light);
  font-weight: 600;
  width: auto;
  margin-bottom: 0px;
  min-height: 33px;
  min-width: 150px;
  float:left;
}

.reuse-label {
  color: var(--theme-main-color-light);
  font-weight: 600;
  width: auto;
  margin-bottom: 0px;
  min-height: 17px;
  min-width: 150px;

}

.secondary-label {
  color: rgb(60, 60, 60);
  font-weight: 600;
  width: auto;
  min-height: 17px;
  min-width: 150px;
}

.text-shadow{
padding:3px;
}

.controls .slider-container {
  margin-left: 0rem;
  width: 450px;
  text-align: center;

}

.slider-input {
  margin-top: 1rem;
  margin-left: 1.5rem;
  margin-right: 2.5rem;
  font-size: 2em;
}

#app .sliderColor {
  --slider-connect-bg: var(--theme-accent-color) !important;
  --slider-tooltip-bg: var(--theme-accent-color) !important;
  --slider-tooltip-font-size: 0.65em;
  --slider-tooltip-py: 5px;
  --slider-tooltip-px: 6px;
  --slider-handle-ring-color: rgba(0, 0, 0, 0);
}

.slider-horizontal .slider-tooltip-top {
  background-color: var(--theme-accent-color) !important;
  border-color: var(--theme-accent-color) !important;
}

.slider-connect {
  background-color: var(--theme-accent-color) !important;
}

.buttonrow {
  top: 50px;
  left: 50px;
  z-index: 12;
  position: absolute;
}</style>