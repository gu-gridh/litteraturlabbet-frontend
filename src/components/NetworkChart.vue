<template>
  <div class="chart-container">
    <div id="chart" ref="element"></div>
    <div v-if="!loading" class="dropdown">
      <button class="dropbtn">Instruktioner</button>
      <div class="dropdown-content">
        <div>Håll muspekaren över punkterna för att visa författaren.</div>
        <div>Klicka på en punkt för att centrera nätverket.</div>
        <div>Klicka och dra för att flytta på nätverksvyn.</div>
        <div>Skrolla med mushjulet eller -plattan för att zooma.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ForceGraph from "force-graph";
import type { Author } from "@/types/litteraturlabbet";
import { ref, watch } from "vue";
import type { Link } from "@/types/network";
import { unpaginated, list } from "@/services/diana";
import { useRoute } from "vue-router";
import { searchStore } from "@/stores/search";

const store = searchStore();
const props = defineProps<{
  author?: number;
  height: number;
  width: number;
}>();

type NodeType<T> = {
  id: number;
  name: string;
  color: string;
  neighbors: Array<T>;
  links: Array<Link>;
};
interface Node extends NodeType<Node> {}

const element = ref();
const route = useRoute();
const loading = ref(true);

async function fetchData(author?: number) {
  let links = await unpaginated<Link>("author_exchange", {});
  let ids = links
    .map((l) => l.source)
    .concat(links.map((l) => l.target))
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

  let nodes = await list<Author>("author", { limit: 500 }).then((a) => {
    const authors = a.results.filter((a) => ids.includes(a.id));

    return authors.map((a) => {
      return {
        id: a.id,
        name: a.name,
        // color: "rgb(182, 82, 139)",
        neighbors: new Array<Node>(),
        links: new Array<Link>(),
      } as Node;
    });
  });

  // Filter the nodes and link after the selected author
  // if (author) {
  //   links = links.filter((l) => l.source === author || l.target === author);
  //   let linkNodes = links
  //     .map((l) => l.source)
  //     .concat(links.map((l) => l.target));
  //   nodes = nodes.filter((n) => linkNodes.includes(n.id));
  // }

  // Create a graph
  const graph = ForceGraph();
  const highlightNodes = new Set();
  const highlightLinks = new Set();

  const data = { nodes: nodes, links: links };
  data.links.forEach((link) => {
    const a = data.nodes.filter((n) => n.id === link.source)[0];
    const b = data.nodes.filter((n) => n.id === link.target)[0];
    !a.neighbors && (a.neighbors = []);
    !b.neighbors && (b.neighbors = []);
    a.neighbors.push(b);
    b.neighbors.push(a);

    !a.links && (a.links = []);
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
  });

  let hoverNode: Node | null = null;

  if (props.author) {
    hoverNode = data.nodes.filter((n) => n.id === props.author)[0];
    highlightNodes.add(hoverNode);
    hoverNode.neighbors.forEach((neighbor: Node) =>
      highlightNodes.add(neighbor)
    );
    hoverNode.links.forEach((link: Link) => highlightLinks.add(link));
  }

  graph(element.value)
    .graphData({ nodes: nodes, links: links })
    .width(props.width)
    .height(props.height)
    .linkWidth((link) => {
      let weight = links.filter(
        (l) => l.source === link.source && l.target === link.target
      )[0].weight;

      // Filter them by their weight
      weight = weight ? 2 * Math.log(weight) : 1;

      return weight;
    })
    .onNodeClick(async (node) => {
      // Center/zoom on node
      graph.centerAt(node.x, node.y, 1000);
      graph.zoom(3, 2000);

      if (store.author?.id !== node.id) {
        // store.author = await get<Author>(node.id as number, "author");
      }
    })
    .onNodeHover((node) => {
      if (!props.author) {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
          highlightNodes.add(node);
          node.neighbors.forEach((neighbor: Node) =>
            highlightNodes.add(neighbor)
          );
          node.links.forEach((link: Link) => highlightLinks.add(link));
        }

        hoverNode = props.author
          ? data.nodes.filter((n) => n.id === props.author)[0]
          : node || null;
      }
    })
    .onLinkHover((link) => {
      if (!props.author) {
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
        return "violet";
      } else {
        return "rgb(182, 82, 139)";
      }
    })
    .cooldownTime(4500)
    .onEngineStop(() => {
      if (props.author && hoverNode && !loading.value) {
        setTimeout(() => {
          hoverNode = data.nodes.filter((n) => n.id === props.author)[0];
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
  async (params) => {
    loading.value = true;
    await fetchData(props.author);
    loading.value = false;
  },
  {
    immediate: true,
    deep: true,
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

.chart-container {
  margin-top: 20px;
  padding-bottom: 20px;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 2rem;
  margin-right: 2rem;
}

.dropbtn {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.4rem 1rem 0.4rem 1rem;
  font-size: 20px;
  color: white;
  background-color: rgb(182, 82, 139);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;
  cursor: pointer;
}

.dropbtn:hover {
  background-color: rgb(233, 102, 176) !important;
  color: black !important;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: absolute;
  display: inline-block;
  z-index: 10;
  width: 20%;
  top: 0px;
  right: 0px;
  margin-right: 1rem;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: transparent;
  min-width: 160px;
  /* box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2); */
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
  z-index: 100;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
