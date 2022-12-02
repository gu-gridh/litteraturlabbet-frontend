interface Link {
  source: number;
  target: number;
  weight?: number;
  color?: string;
}

interface Node {
  id: number;
  color?: string;
  group: number;
  name: string;
}

interface Items {
  nodes: Array<Node>;
  links: Array<Link>;
}

interface Options {
  nodeId: (d: Node) => number; // given d in nodes, returns a unique identifier (string)
  nodeGroup: (d: Node) => number; // given d in nodes, returns an (ordinal) value for color
  nodeGroups: Iterable<number>; // an array of ordinal values representing the node groups
  nodeTitle: (d: Node) => string; // given d in nodes, a title string
  nodeFill: string; // node stroke fill (if not using a group color encoding)
  nodeStroke: string; // node stroke color
  nodeStrokeWidth: number; // node stroke width, in pixels
  nodeStrokeOpacity: number; // node stroke opacity
  nodeRadius: number; // node radius, in pixels
  nodeStrength?: number;
  linkSource: (d: Link) => number; // given d in links, returns a node identifier string
  linkTarget: (d: Link) => number; // given d in links, returns a node identifier string
  linkStroke: string; // link stroke color
  linkStrokeOpacity: number; // link stroke opacity
  linkStrokeWidth: (d: Link) => number; // given d in links, returns a stroke width in pixels
  linkStrokeLinecap: string; // link stroke linecap
  linkDistance?: number;
  linkStrength?: number;
  colors: Array<String> | Readonly<Array<String>>; // an array of color strings, for the node groups
  width: number; // outer width, in pixels
  height: number; // outer height, in pixels
  invalidation?: any; // when this promise resolves, stop the simulation
}

export type { Link, Node, Items, Options };
