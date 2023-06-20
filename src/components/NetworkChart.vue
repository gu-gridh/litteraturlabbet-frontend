<template>
  <div class="dropdown-super">
    <div class="dropdown">
      <button class="dropbtn">Instruktioner</button>
      <div class="dropdown-content">
        <div>Håll muspekaren över punkterna för att visa författaren.</div>
        <div>Klicka på en punkt för att centrera nätverket.</div>
        <div>Dubbel- eller högerklicka på punkten för att söka.</div>
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
import { get } from "@/services/diana";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { searchStore } from "@/stores/search";
import { link } from "d3";

const authorStore = searchStore();
const props = defineProps<{
  data: { nodes: Array<Node> | undefined; links: Array<Link> | undefined };
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

function findSecondaryConnections(nodes: any, authorId: any) {
  const visited = new Set();
  const secondaryConnections: any[] = [];

  const stack = [];
  stack.push(authorId);

  while (stack.length > 0) {
    const currentId = stack.pop();

    if (visited.has(currentId)) {
      continue;
    }

    visited.add(currentId);

    const currentNode = nodes.find((n) => n.id === currentId);

    if (currentNode) {
      currentNode.neighbors.forEach((neighbor) => {
        secondaryConnections.push(neighbor);
        stack.push(neighbor.id);
      });
    }
  }

  return secondaryConnections;
}
function build(graphData: any, author?: number) {
  console.log(graphData);
  console.log(author);
  const graph = ForceGraph();
  const highlightNodes = new Set();
  const highlightLinks = new Set();
  const data = structuredClone(graphData);
  // Check if node is in the network
  // If not, return empty graph
  if (author && data.nodes.filter((n: any) => n.id === author).length === 0) {
    return graph;
  }
  if (!author) {
    return graph;
  }
  let seenNeighbors: any[] = [];
  /*
  
  // Convert node ids to node objects for force-graph
  const authorNode = data.nodes.filter((n: any) => n.id === author)[0];
  const primaryConnections = [];
  const sourceLinks = data.links.filter((l: Link) => l.source === author);
  const targetLinks = data.links.filter((l: Link) => l.target === author);
  */
console.log(data.links);
  data.links = data.links.map(function (link: Link) {
  //console.log("Link:", link);
  //console.log("Source Node:", data.nodes.find(function (n) { return n.id === link.source; }));
  //console.log("Target Node:", data.nodes.find(function (n) { return n.id === link.target; }));

  const sourceNode = data.nodes.find(function (n) { return n.id === link.source; });
  const targetNode = data.nodes.find(function (n) { return n.id === link.target; });

  if (sourceNode && targetNode) {
    const isCurrentAuthor = sourceNode.id === author || targetNode.id === author;
    const isNeighbor = seenNeighbors.indexOf(sourceNode.id) > -1;

    // just connection or also the connections of the connections
    if (isCurrentAuthor || isNeighbor) {
      // Ensure source and target have the neighbors and links properties
      sourceNode.neighbors = sourceNode.neighbors || [];
      targetNode.neighbors = targetNode.neighbors || [];
      sourceNode.links = sourceNode.links || [];
      targetNode.links = targetNode.links || [];

      // Update the connections
      sourceNode.neighbors.push(targetNode);
      targetNode.neighbors.push(sourceNode);
      sourceNode.links.push(link);
      targetNode.links.push(link);

      seenNeighbors.push(targetNode.id);
      
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
console.log(data.links);
  let hoverNode: Node;
  if (author) {
    hoverNode = data.nodes.filter((n: any) => n.id === author)[0];
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
      weight = weight ? 1.2 * Math.log(weight) : 1;
      return weight;
    })
    .onNodeClick(async (node) => {
      // Center/zoom on node
      graph.centerAt(node.x, node.y, 1000);
      graph.zoom(3, 2000);
        if (authorStore.author?.id !== node.id) {
        authorStore.author = await get<Author>(node.id as number, "author");
          await router.push({
          name: "reuse",
          query: {
            author: node.id,
            work: undefined,
          },
        });
    
      }
    })
    .onNodeRightClick(async (node) => {
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
    .onLinkHover((link: any) => {
      
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
    .onLinkClick((link) => {
      //TODO on click go to reuse page
      console.log(link);
      // const tId = link.target?.id
      // let segment = link.source?.neighbors.find(item => item.id === tId)
      // console.log(segment)

    })
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