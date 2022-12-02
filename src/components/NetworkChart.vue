<template>
  <div class="chart-container">
    <div id="chart" ref="element"></div>
  </div>
</template>

<script setup lang="ts">
import ForceGraph from "force-graph";
import type { Author } from "@/types/litteraturlabbet";
import { ref, watch } from "vue";
import type { Node, Link } from "@/types/network";
import { unpaginated, list } from "@/services/diana";

const props = defineProps<{
  author?: number;
}>();

const links = ref<Array<Link>>([]);
const nodes = ref<Array<Node>>([]);
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

    // Filter the nodes and link after the selected author
    if (props.author) {
      links.value = links.value.filter(
        (l) => l.source === props.author || l.target === props.author
      );
      let linkNodes = links.value
        .map((l) => l.source)
        .concat(links.value.map((l) => l.target));
      nodes.value = nodes.value.filter((n) => linkNodes.includes(n.id));
    }

    const items = {
      nodes: nodes.value,
      links: links.value,
    };

    const graph = ForceGraph();

    graph(element.value)
      .graphData(items)
      .width(700)
      .height(300)
      .linkWidth((link) => {
        let weight = links.value.filter(
          (l) => l.source === link.source && l.target === link.target
        )[0].weight;

        weight = weight ? 2 * Math.log(weight) : 1;

        return weight;
      })
      .onNodeClick((node) => {
        // Center/zoom on node
        graph.centerAt(node.x, node.y, 1000);
        graph.zoom(3, 2000);
      });
    // forceGraph(element, items, options);
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
