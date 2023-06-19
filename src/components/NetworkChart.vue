<template>
  <div class="dropdown-super">
    <div class="dropdown">
      <button class="dropbtn">Instruktioner</button>
      <div class="dropdown-content">
        <div>Håll muspekaren över punkterna för att visa författaren.</div>
        <div>Klicka på en punkt för att centrera nätverket.</div>
        <div>Klicka och dra för att flytta på nätverksvyn.</div>
        <div>Skrolla för att zooma.</div>
      </div>
    </div>
  </div>
  <div class="chart-super-container">
    <div class="chart-container">
      <div id="chart" ref="element"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ForceGraph, { type GraphData } from "force-graph";
import type { Author } from "@/types/litteraturlabbet";
import { ref, watch, onMounted, nextTick } from "vue";
import type { Link, Node } from "@/types/network";
import { unpaginated, list, get } from "@/services/diana";
import { useRoute } from "vue-router";
import { searchStore } from "@/stores/search";
import { networkStore } from "@/stores/network";
const authorStore = searchStore();
const nodeAndLinkStore = networkStore();
const props = defineProps<{
  data: { nodes: Array<Node> | undefined; links: Array<Link> | undefined };
  author?: number;
  height: number;
  width: number;
}>();
const element = ref();
const route = useRoute();
const loading = ref(true);
// const graph = build(props.data, props.author);
const graph = ref();

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
function build(graphData: any, author?: number) {
  console.log(graphData);
  const graph = ForceGraph();
  const highlightNodes = new Set();
  const highlightLinks = new Set();
  const data = structuredClone(graphData);
  // Check if node is in the network
  // If not, return empty graph
  if (author && data.nodes.filter((n: any) => n.id === author).length === 0) {
    return graph;
  }
  // Convert node ids to node objects for force-graph
  data.links = data.links.map((link) => {
    const a = data.nodes.find((n) => n.id === link.source);
    const b = data.nodes.find((n) => n.id === link.target);
    if (a && b) {
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);
      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
      return {
        ...link,
        source: a,
        target: b,
      };
    }
    return null;
  }).filter(link => link); // removes null values
  let hoverNode: Node;
  if (author) {
    hoverNode = data.nodes.filter((n) => n.id === author)[0];
    highlightNodes.add(hoverNode);
    hoverNode.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
    hoverNode.links.forEach((link: Link) => highlightLinks.add(link));
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
      weight = weight ? 2 * Math.log(weight) : 1;
      return weight;
    })
    .onNodeClick(async (node) => {
      // Center/zoom on node
      graph.centerAt(node.x, node.y, 1000);
      graph.zoom(3, 2000);
      if (authorStore.author?.id !== node.id) {
        authorStore.author = await get<Author>(node.id as number, "author");
      }
    })
    .onNodeHover((node) => {
      if (!author) {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
          highlightNodes.add(node);
          node.neighbors.forEach((neighbor: Node) =>
            highlightNodes.add(neighbor)
          );
          node.links.forEach((link: Link) => highlightLinks.add(link));
        }
        hoverNode = author
          ? data.nodes.filter((n: Node) => n.id === author)[0]
          : node || null;
      }
    })
    .onLinkHover((link) => {
      if (!author) {
        highlightNodes.clear();
        highlightLinks.clear();
        if (link) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }
      }
    })
    .autoPauseRedraw(false) // keep redrawing after engine has stopped
    .linkDirectionalParticles(4)
    .linkDirectionalParticleWidth((link) => (highlightLinks.has(link) ? 4 : 0))
    .nodeCanvasObjectMode((node) =>
      highlightNodes.has(node) ? "before" : undefined
    )
    .nodeColor((node) => {
      if (node === hoverNode) {
        return "darkorange";
      } else if (highlightNodes.has(node)) {
        return "#66CCFF";
      } else {
        return "rgb(85, 85, 85)";
      }
    })
    .cooldownTime(2500)
    .onEngineStop(() => {
      if (author && hoverNode && !loading.value) {
        setTimeout(() => {
          hoverNode = data.nodes.filter((n) => n.id === author)[0];
          graph.centerAt(hoverNode.x, hoverNode.y, 1000);
          graph.zoom(3, 2000);
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
    // graph.value = build(data.value, props.author);
    loading.value = false;
  },
  {
    // immediate: true,
    // deep: true,
  }
);
</script>
<style>
.legend {
  width: 20%;
  /* position: absolute; */
  top: 0px;
  right: 100px;
  z-index: 10;
}
.chart-super-container {
  width: 100%;
  margin-right: 0rem;
}
.chart-container {
  left: 0%;
  width:100%;
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
  top: 0px;
  right: 0px;
  margin-right: 0em;
  float: right;
  height: auto;
  padding: 10px 10px 10px 0px;
  border-radius: 12px;
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
  background-color: black;
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
.dropdown {
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  padding: 5px;
  float: right;
  display: none;
  border-radius: 10px;
  font-size: 16px;
  min-width: 160px;
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
.dropdown-super:hover .dropdown-content {
  display: block;
}
.dropdown-super:hover .dropbtn {
  background-color: rgb(80,80,80) !important;
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
  color: black;
  background: rgba(255,255,255,0.9);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  visibility: hidden; /* by default */
}
</style>