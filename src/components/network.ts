import type { Ref } from "vue";
import type { Node, Link, Items, Options } from "@/types/network";
import * as d3 from "d3";

export function forceGraph(ref: Ref, items: Items, options: Options) {
  // Compute values.
  console.log('ref:', ref)
  const nodes = items.nodes;
  const links = items.links;
  console.log(items)

  const N = d3.map(nodes, options.nodeId).map(intern);
  const LS = d3.map(links, options.linkSource).map(intern);
  const LT = d3.map(links, options.linkTarget).map(intern);
  if (options.nodeTitle === undefined) options.nodeTitle = options.nodeId;
  const T = options.nodeTitle == null ? null : d3.map(nodes, options.nodeTitle);
  const G =
    options.nodeGroup == null
      ? null
      : d3.map(nodes, options.nodeGroup).map(intern);
  const W =
    typeof options.linkStrokeWidth !== "function"
      ? null
      : d3.map(links, options.linkStrokeWidth);
  const L =
    typeof options.linkStroke !== "function"
      ? null
      : d3.map(links, options.linkStroke);

  // Compute default domains.
  if (G && options.nodeGroups === undefined) options.nodeGroups = d3.sort(G);

  // Construct the scales.
  const color =
    options.nodeGroup == null
      ? (d: any) => "gray"
      : d3.scaleOrdinal(options.nodeGroups, options.colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody().distanceMin(500).distanceMax(1000);
  const forceLink = d3
    .forceLink(links)
    .id(
      (
        node: d3.SimulationNodeDatum,
        i: number,
        nodesData: d3.SimulationNodeDatum[]
      ) => N[i]
    );
  if (options.nodeStrength !== undefined)
    forceNode.strength(options.nodeStrength);
  if (options.linkStrength !== undefined)
    forceLink.strength(options.linkStrength);
  if (options.linkDistance !== undefined)
    forceLink.distance(options.linkDistance);

  const simulation = d3
    .forceSimulation(nodes as d3.SimulationNodeDatum[])
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter())
    .on("tick", ticked);

  d3.selectAll("svg > *").remove();
  const svg = d3
    .select(ref.value)
    .attr("width", options.width)
    .attr("height", options.height)
    .attr("viewBox", [
      -options.width *(1.5/2) ,
      -options.height *(1.5/2),
      1.5*options.width,
      1.5* options.height,
    ])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const link = svg
    .append("g")
    .attr(
      "stroke",
      typeof options.linkStroke !== "function" ? options.linkStroke : null
    )
    .attr("stroke-opacity", options.linkStrokeOpacity)
    .attr(
      "stroke-width",
      typeof options.linkStrokeWidth !== "function"
        ? options.linkStrokeWidth
        : null
    )
    .attr("stroke-linecap", options.linkStrokeLinecap)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g");

  const circles = node
    .append("circle")
    .attr("stroke", options.nodeStroke)
    .attr("stroke-opacity", options.nodeStrokeOpacity)
    .attr("stroke-width", options.nodeStrokeWidth)
    .attr("r", options.nodeRadius);

  const labels = node
    .append("text")
    .text(options.nodeTitle)
    .attr("class", "node-text")
    .attr("x", 6)
    .attr("y", 3);

  node.call(drag(simulation) as any);

  options.linkStrokeWidth
    ? link.attr("stroke-width", options.linkStrokeWidth)
    : link.attr("stroke-width", 1);
  options.linkStroke
    ? link.attr("stroke", options.linkStroke)
    : link.attr("stroke", "gray");

  options.nodeGroup
    ? node.attr("fill", (d: any) => {
        return color(options.nodeGroup(d));
      })
    : node.attr("fill", "gray");

  node.append("title").text((d: any) => {
    const title = options.nodeTitle ? options.nodeTitle(d) : options.nodeId(d);

    return `${title}`;
  });

  link.append("title").text((d: any) => {
    const title = d.weight;

    return `Antal stycken: ${title}`;
  });

  if (options.invalidation != null)
    options.invalidation.then(() => simulation.stop());

  function intern(value: any) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function ticked() {
    const textOffset = 40;

    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node
      .selectAll("circle")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y);

    node
      .selectAll("text")
      .attr("x", function (d: any) {
        return d.x - textOffset;
      })
      .attr("y", function (d: any) {
        return d.y + textOffset;
      });
  }

  function drag(
    simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
  ): d3.DragBehavior<Element, unknown, unknown> {
    function dragstarted(this: Element, event: any, d: unknown): void {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(this: Element, event: any, d: unknown): void {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(this: Element, event: any, d: unknown): void {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  
  return Object.assign(svg.node(), { scales: { color } });
}
