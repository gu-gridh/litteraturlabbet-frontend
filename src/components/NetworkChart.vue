<template>
  <div class="chart-container">
    <div id="chart" ref="element"></div>
  </div>
</template>

<script setup lang="ts">

import ForceGraph from "force-graph";
import type { Author } from "@/types/litteraturlabbet";
import { nextTick, ref, watch } from "vue";
import type { Node, Link } from "@/types/network";
import { unpaginated, list } from "@/services/diana";

const props = defineProps<{
  author?: number;
}>();

const element = ref();

// Initial
nextTick()
// await fetchData(props.author)

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
        color: "rgb(182, 82, 139)"
      };
    });
  });

  // Filter the nodes and link after the selected author
  if (author) {
    links = links.filter((l) => l.source === author || l.target === author);
    let linkNodes = links
      .map((l) => l.source)
      .concat(links.map((l) => l.target));
    nodes = nodes.filter((n) => linkNodes.includes(n.id));
  }

  // Create a graph
  const graph = ForceGraph();

  graph(element.value)
    .graphData({ nodes: nodes, links: links })
    .width(600)
    .height(300)
    .linkWidth((link) => {
      let weight = links.filter(
        (l) => l.source === link.source && l.target === link.target
      )[0].weight;

      // Filter them by their weight
      weight = weight ? 2 * Math.log(weight) : 1;

      return weight;
    })
    .onNodeClick((node) => {
    // Center/zoom on node
      graph.centerAt(node.x, node.y, 1000);
      graph.zoom(3, 2000);
    });
}

watch(
  () => props.author,
  async () => await fetchData(props.author)
);

</script>

<style>
.links line {
  stroke: #999;
  stroke-opacity: 0.1;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

.node-text {
  font-family: sans-serif;
  font-size: 20px !important;
  font-weight:100;
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

.placeholder {
  font-size: 30px;
  font-style: italic;
  margin-left: 20px;
  font-weight: normal;
  height: 100px;
}
</style>
