<template>
  <div class="chart-container">
    <svg ref="element"></svg>
    <!-- <span v-else class="placeholder">Välj en författare</span> -->
  </div>
</template>

<script setup lang="ts">
// import * as d3 from "d3";
import { forceGraph } from "./network";

import type { Author, Paginated, Cluster } from "@/types/litteraturlabbet";
import { computed, ref, watchEffect } from "vue";
import type { Node, Link, Options, Items } from "@/types/network";
import { unpaginated, get, list } from "@/services/diana";

const options: Options = {
  nodeId: (d: Node) => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup: (d) => d.group, // given d in nodes, returns an (ordinal) value for color
  nodeGroups: [1, 2],
  nodeTitle: (d) => {
    return d.name ? d.name : d.id.toString();
  }, // given d in nodes, a title string
  nodeFill: "currentColor", // node stroke fill (if not using a group color encoding)
  nodeStroke: "#fff", // node stroke color
  nodeStrokeWidth: 1.5, // node stroke width, in pixels
  nodeStrokeOpacity: 1, // node stroke opacity
  nodeStrength: -100,
  nodeRadius: 15, // node radius, in pixels
  linkSource: ({ source }) => source, // given d in links, returns a node identifier string
  linkTarget: ({ target }) => target, // given d in links, returns a node identifier string
  linkStroke: "#999", // link stroke color
  linkStrokeOpacity: 0.6, // link stroke opacity
  linkStrokeWidth: (link) =>
    link.weight ? 1.5 * Math.log(link.weight + 1) + 1 : 1, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap: "round", // link stroke linecap
  linkDistance: 50,
  linkStrength: 0.1,
  colors: ["orange", "chocolate"], // an array of color strings, for the node groups
  width: 700, // outer width, in pixels
  height: 700, // outer height, in pixels
};

const links = ref<Array<Link>>([]);
const nodes = ref<Array<Node>>([]);
// const authors = ref<Array<Author>>([]);
const ids = ref<Array<number>>([]);
const element = ref();

// Fetch all links
unpaginated<Link>("author_exchange", {}).then((l) => {
  links.value = l;

  // Find the unique nodes used
  ids.value = links.value
    .map((l) => l.source)
    .concat(links.value.map((l) => l.target))
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

  // Only use used Author nodes
  list<Author>("author", { limit: 500 }).then((a) => {
    const authors = a.results.filter((a) => ids.value.includes(a.id));

    nodes.value = authors.map((a) => {
      return {
        id: a.id,
        color: "purple",
        group: 1,
        name: a.name,
      } as Node;
    });

    // console.log(nodes.value.filter(n => n.id == 3323))
    const items = {
      nodes: nodes.value,
      links: links.value,
    } as Items;

    forceGraph(element, items, options);
  });
});
</script>

<style>
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

.node-text {
  font-family: sans-serif;
  font-size: 15px !important;
}

.chart-container {
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.placeholder {
  font-size: 30px;
  font-family: "Libre Baskerville";
  font-style: italic;
  margin-left: 20px;
  font-weight: normal;
  height: 100px;
}
</style>
